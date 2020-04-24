<template>
    <div class="covid-map">
        <h1>Aristotle Covid-19 Map</h1>
        <div class="row">
            <div class="col-md-8 col-12">
                <map-display
                    :map-data="mapData"
                    :color-axis-max-value="colorAxisMaxValue"
                />
            </div>
            <div class="col-md-4 col-12 vertical-container">
                <selector
                        v-model="selectedCategory"
                        description="Choose a data element"
                        :options="options"
                />
                <div class="form-block">
                    <label>Date</label>
                    {{ formattedDate }}
                    <vue-slider
                            v-model="sliderDateValue"
                            :data="datesData"
                    />
                    <button @click="playMapDates">
                        {{ buttonText }}
                    </button>
                </div>
                <div v-for="checkboxSection in checkboxSections" :key="checkboxSection.propertyId">
                    <checkbox-section
                            :name="checkboxSection.propertyName"
                            :id="checkboxSection.propertyId"
                            :options="checkboxSection.options"
                            @updateCheckedOpt="updateCheckedOptions"
                    />
                </div>
<!--                <span>Checked transmition options: {{ checkedTransmissionOptions }}</span>-->
<!--                <span>Checked region options: {{ checkedRegionOptions }}</span>-->
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <metadata-display :selected="allSelected" :dss="dss" tooltips />
            </div>
        </div>
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import CheckboxSection from '@/components/CheckboxSection.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import {
    getCovidData,
    getDistribution,
    getDistributionOptions,
    getDistributionCheckboxSections,
    getDatasetSpecification,
    getMapFilterOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/covid.js'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
const moment = require('moment');

export default {
    data: () => ({
        dss: {},
        selectedCategory: '',
        checkboxSections: [],
        checkedTransmissionOptions: [],
        checkedRegionOptions: [],
        options: [],
        dataMapping: new Map(),
        sliderDateValue: 0,
        datesData: [],
        buttonText: "Play",
    }),
    components: {
        'selector': Selector,
        'map-display': MapDisplay,
        'metadata-display': MetadataDisplay,
        'checkbox-section': CheckboxSection,
        'vue-slider': VueSlider,
    },
    mounted: function() {

        getCovidData().then((data) => {
            this.covidData = data

            this.datesData = getMapFilterOptions(data, "dateRep").sort(function (a, b) {
                return dateToNum(a) - dateToNum(b)
            });

            this.sliderDateValue = this.datesData[this.datesData.length - 1]

            function dateToNum(date) {
                // Convert date "26/06/2016" to 20160626
                date = date.split("/");
                return Number(date[2] + date[1] + date[0]);
            }
        }).catch((error) => {
            // TODO handle errors gracefully
            console.error(error)
        })

        getDistribution().then((data) => {
            this.distribution = data
            this.options = getDistributionOptions(data, filterNumberDataElements)
            this.checkboxSections = getDistributionCheckboxSections(data, filterValueDataElements)
            this.dataMapping = mapDistributionData(data)
        }).catch((error) => {
            // TODO handle errors gracefully
            console.error(error)
        })

        getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            // TODO handle errors gracefully
            console.error(error)
        })

    },
    computed: {
        mapData: function () {

            if (!this.dataMapping.has(this.selectedCategory)) {
                return [["Country", "Country name"]]
            }

            let sel = this.dataMapping.get(this.selectedCategory)

            let mapAttributes = [["Country", "Country name", this.camelCaseToSentenceCase(sel)]]

            for (const jsonElement of this.covidData) {

                if (this.sliderDateValue === jsonElement['dateRep'] &&
                    this.checkedTransmissionOptions.includes(jsonElement['transmissionClassification']) &&
                    this.checkedRegionOptions.includes(jsonElement['region'])
                ) {
                    mapAttributes.push(
                        [
                            jsonElement['geoId'],
                            jsonElement['reportingArea'],
                            parseInt(jsonElement[sel]),
                        ]
                    )
                }
            }

            if (mapAttributes.length === 1) {  // This is necessary to avoid an error with the Google API.
                return [["Country", "Country name"]]
            }

            return mapAttributes
        },
        colorAxisMaxValue: function () {
            let sel = this.dataMapping.get(this.selectedCategory)
            let maxValue = 0

            if (!this.dataMapping.has(this.selectedCategory)) {
                return maxValue
            }
            for (const jsonElement of this.covidData) {
                let currentValue = parseInt(jsonElement[sel])
                if (currentValue > maxValue) {
                    maxValue = currentValue
                }
            }
            return maxValue
        },
        allSelected: function() {
            return [this.selectedCategory]
        },
        formattedDate: function () {
            if (this.sliderDateValue !== 0) {
                return moment(this.sliderDateValue, "DD-MM-YYYY").format("dddd, DD MMMM YYYY")
            }
            return ""
        },
    },
    methods: {
        camelCaseToSentenceCase: (text) => {
            let result = text.replace(/[^0-9](?=[0-9])/g, '$& ').replace( /([A-Z])/g, " $1" )
            return result.charAt(0).toUpperCase() + result.slice(1)
        },
        updateCheckedOptions: function (opts, name) {
            if (name === "Transmission classification") {
                this.checkedTransmissionOptions = opts
            }
            else if (name === "Region Identifier") {
                this.checkedRegionOptions = opts
            }
        },
        playMapDates: function () {

            this.buttonText === "Play" ? this.buttonText = "Pause" : this.buttonText = "Play"

            let timeOut = 0
            let currentIndex = this.datesData.findIndex((elem) => {return elem === this.sliderDateValue})
            for (let i = currentIndex; i < this.datesData.length - 1; i++) {
                if (this.buttonText === "Pause") {
                    setTimeout (() => {
                        this.sliderDateValue = moment(this.sliderDateValue, "DD/MM/YYYY").add(1, 'day').format("DD/MM/YYYY")
                    }, timeOut += 100)
                }
            }
        },
    },
}
</script>

<style scoped>
h1 {
    border-bottom: 1px solid black;
}

.root {
    display: flex;
    flex-direction: column;
}

.vertical-container {
    display: flex;
    flex-direction: column;
}

.placeholder-metadata {
    margin-top: 50px;
}

.form-block {
    display: block;
    margin: 20px;
}
</style>
