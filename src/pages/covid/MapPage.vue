<template>
    <div class="covid-map">
        <h1>Aristotle Covid-19 Map</h1>
        <error-group :errors="errors" />
        <loading v-if="loading" />
        <template v-else>
            <div class="row">
                <div class="col-md-8 col-12">
                    <map-display
                        :map-data="mapData"
                        :color-axis-max-value="colorAxisMaxValue"
                    />
                </div>
                <div class="col-md-4 col-12 vertical-container">
                    <radio-selector
                            v-model="selectedCategory"
                            description="Choose a data element"
                            :options="options"
                    />
                    <div class="form-block">
                        <strong>Date</strong><br>
                        {{ formattedDate }}<br>
                        <div class="d-flex">
                            <button type="button" class="btn btn-sm" :class="{ 'btn-outline-info': !datesPlaying, 'btn-outline-success': datesPlaying }" @click="playMapDates">
                                <i v-if="!datesPlaying" class="fas fa-play" />
                                <i v-else class="fas fa-pause" />
                            </button>
                            <vue-slider class="flex-grow-1 align-self-center pl-1"
                                    v-model="sliderDateValue"
                                    :data="datesData"
                            />
                        </div>
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
                    <metadata-display :selected="allSelected" :dss="dss" />
                </div>
            </div>
        </template>
    </div>
</template>

<script>
import RadioSelector from "@/components/RadioSelector.vue"
import CheckboxSection from '@/components/CheckboxSection.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import ErrorGroup from '@/components/error/ErrorGroup.vue'
import Loading from '@/components/Loading.vue'
import {
    getCovidData,
    getDistribution,
    getDistributionCheckboxSections,
    getDatasetSpecification,
    getMapFilterOptions,
} from '@/data/covid.js'
import {
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/api.js'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
const moment = require('moment');

export default {
    data: () => ({
        loading: true,
        errors: [],
        dss: {},
        selectedCategory: '',
        checkboxSections: [],
        checkedTransmissionOptions: [],
        checkedRegionOptions: [],
        options: [],
        dataMapping: new Map(),
        sliderDateValue: 0,
        datesData: [],
        datesPlaying: false,
        timer: '',
    }),
    components: {
        'radio-selector': RadioSelector,
        'map-display': MapDisplay,
        'metadata-display': MetadataDisplay,
        'checkbox-section': CheckboxSection,
        'vue-slider': VueSlider,
        'error-group': ErrorGroup,
        'loading': Loading,
    },
    mounted: function() {

        let dataPromise = getCovidData().then((data) => {
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
            this.errors.push(error)
        })

        let distPromise = getDistribution().then((data) => {
            this.distribution = data
            this.options = getDistributionOptions(data, filterNumberDataElements)
            this.selectedCategory = this.options[0].value
            this.checkboxSections = getDistributionCheckboxSections(data, filterValueDataElements)
            this.dataMapping = mapDistributionData(data)
        }).catch((error) => {
            this.errors.push(error)
        })

        let dssPromise = getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            this.errors.push(error)
        })

        // Stop loading once all promises resolved
        Promise.all([dataPromise, distPromise, dssPromise]).finally(() => {
            this.loading = false;
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

            this.datesPlaying === false ? this.datesPlaying = true : this.datesPlaying = false

            if (this.datesPlaying) {
                this.timer = setInterval(() => {
                    let currentIndex = this.datesData.findIndex((elem) => {return elem === this.sliderDateValue})
                    if (currentIndex < this.datesData.length - 1) {
                        this.sliderDateValue = moment(this.sliderDateValue, "DD/MM/YYYY").add(1, 'day').format("DD/MM/YYYY")
                    } else {
                        clearInterval(this.timer)
                        this.datesPlaying = false
                    }
                }, 100)
            } else {
                clearInterval(this.timer)
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
