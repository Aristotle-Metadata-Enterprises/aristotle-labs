<template>
    <div class="covid-map">
        <h1>Aristotle Covid Map</h1>
        <div class="horizontal-container">
            <map-display
                    :map-data="mapData"
                    :color-axis-max-value="colorAxisMaxValue"
            />
            <div class="vertical-container">
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
                <filters
                        :options="filterTransmisionOptions"
                        @updateCheckedOpt="updateTransmitionOpts"
                />
                <filters
                        :options="filterRegionOptions"
                        @updateCheckedOpt="updateRegionOpts"
                />

<!--                <span>Checked transmition options: {{ checkedTransmitionOptions }}</span>-->
<!--                <span>Checked region options: {{ checkedRegionOptions }}</span>-->
            </div>
        </div>
        <metadata-display :selected="allSelected" :dss="dss" />
    </div>
</template>

<script>

    import Selector from '@/components/Selector.vue'
    import Filters from '@/components/Filters.vue'
    import MapDisplay from '@/components/MapDisplay.vue'
    import MetadataDisplay from '@/components/MetadataDisplay.vue'
    import {
        getCovidData,
        getDistribution,
        getDistributionOptions,
        getMapFilterOptions,
        getDatasetSpecification,
        mapDistributionData,
        filterNumberDataElements,
    } from '@/data/covid.js'

    import VueSlider from 'vue-slider-component'
    import 'vue-slider-component/theme/antd.css'
    const moment = require('moment');

    export default {
        data: () => ({
            dss: {},
            selectedCategory: '',
            checkedTransmitionOptions: [],
            checkedRegionOptions: [],
            options: [],
            filterTransmisionOptions: [],
            filterRegionOptions: [],
            dataMapping: new Map(),
            sliderDateValue: 0,
            datesData: [],
            buttonText: "Play",
        }),
        components: {
            'selector': Selector,
            'map-display': MapDisplay,
            'metadata-display': MetadataDisplay,
            'filters': Filters,
            'vue-slider': VueSlider,
        },
        mounted: function() {

            getCovidData().then((data) => {
                this.covidData = data
                this.filterTransmisionOptions = getMapFilterOptions(data, "transmissionClassification")
                this.filterRegionOptions = getMapFilterOptions(data, "region")

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
                        this.checkedTransmitionOptions.includes(jsonElement['transmissionClassification']) &&
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
                const notBoundCovidData = this.getNotBoundCovidData()
                for (const jsonElement of notBoundCovidData) {
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
            updateTransmitionOpts: function (opts) {
                this.checkedTransmitionOptions = opts
            },
            updateRegionOpts: function (opts) {
                this.checkedRegionOptions = opts
            },
            playMapDates: function () {

                this.buttonText === "Play" ? this.buttonText = "Pause" : this.buttonText = "Play"

                let timeOut = 0
                let currentIndex = this.datesData.findIndex((elem) => {return elem === this.sliderDateValue})
                for (let i = currentIndex; i < this.datesData.length - 1; i++) {
                    if (this.buttonText === "Pause") {
                        let that = this
                        setTimeout (function () {
                            that.sliderDateValue = moment(that.sliderDateValue, "DD/MM/YYYY").add(1, 'day').format("DD/MM/YYYY")
                        }, timeOut += 100)
                    }
                }
            },
            getNotBoundCovidData: function () {
                return [...this.covidData]
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

    .horizontal-container {
        display: flex;
        flex-direction: row;
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