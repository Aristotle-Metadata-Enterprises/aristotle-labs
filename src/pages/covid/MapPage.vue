<template>
    <div class="covid-map mt-3 mb-3">
        <h1 class="text-center">
            Aristotle COVID-19 Dashboard - Map view
        </h1>
        <covid-header-text />
        <error-group :errors="errors" />
        <loading v-if="loading" />
        <template v-else class="container">
            <div class="row">
                <div class="col-sm-8">
                    <div class="graph-title">{{ graphTitle }}</div>
                    <div class="map-graph-description">{{ currentDataElementDefinition }}</div>
                </div>
            </div>
            <div class="row">
                <div class="col-md-8 col-12">
                    <map-display
                        :map-data="mapData"
                        :color-axis-max-value="colorAxisMaxValue"
                        :region="selectedRegion"
                    />
                    <div>
                        <strong>Date</strong>: {{ formattedDate }}
                    </div>
                    <div class="d-flex">
                        <div class="btn-group-justified">
                            <button type="button" class="btn btn-sm" :class="{ 'btn-outline-info': !datesPlaying, 'btn-outline-success': datesPlaying }" @click="playMapDates">
                                <i v-if="!datesPlaying" class="fas fa-play" />
                                <i v-else class="fas fa-pause" />
                            </button>
                            <button type="button" :disabled="restartedAndPlaying || datesPlaying" class="btn btn-sm" :class="{ 'btn-outline-success': !restartedAndPlaying, 'disabled btn-outline-secondary': restartedAndPlaying || datesPlaying }" @click="restartAndPlayMapDates">
                                <i class="fas fa-redo-alt" />
                            </button>
                        </div>
                        <vue-slider class="flex-grow-1 align-self-center pl-1"
                                v-model="sliderDateValue"
                                :data="datesData"
                        />
                    </div>
                </div>
                <div class="col-md-4 col-12">
                    <div class="card bg-light option-selector">
                        <radio-selector
                                v-model="selectedCategory"
                                description="Choose a data element"
                                :options="options"
                        />
                        <radio-selector
                                v-model="selectedRegion"
                                description="Region Identifier"
                                :description-id="regionIdentifierId"
                                :options="regionOptions"
                                :tooltip-for-options="false"
                        />
                        <div v-for="checkboxSection in checkboxSections" :key="checkboxSection.id">
                            <checkbox-section
                                    :name="checkboxSection.name"
                                    :id="checkboxSection.id"
                                    :options="checkboxSection.valuemeaningSet"
                                    @updateCheckedOpt="updateCheckedOptions"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <covid-metadata-display id="metadatadisplay" :selected="allSelected" :dss="dss" />
        </template>
        <about-this-display />
    </div>
</template>

<script>
import RadioSelector from "@/components/RadioSelector.vue"
import CheckboxSection from '@/components/CheckboxSection.vue'
import MapDisplay from '@/components/MapDisplay.vue'
import CovidMetadataDisplay from '@/components/CovidMetadataDisplay.vue'
import CovidHeaderText from '@/components/CovidHeaderText.vue'
import AboutThisDisplay from '@/components/AboutThisDisplay.vue'
import ErrorGroup from '@/components/error/ErrorGroup.vue'
import Loading from '@/components/Loading.vue'
import {
    getCovidData,
    getDistribution,
    getDistributionCheckboxSections,
    getDatasetSpecification,
    getConceptualDomain,
    getMapFilterOptions,
} from '@/data/covid.js'
import {
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/api.js'
import { getTextForValue } from '@/utils/options.js'

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
const moment = require('moment')

export default {
    data: () => ({
        loading: true,
        errors: [],
        dss: {},
        selectedCategory: '',
        currentDataElementDefinition: '',
        checkboxSections: [],
        checkedTransmissionOptions: [],
        regionOptions: [],
        regionIdentifierId: '',
        selectedRegion: '',
        options: [],
        dataMapping: new Map(),
        sliderDateValue: 0,
        datesData: [],
        datesPlaying: false,
        timer: '',
        restartedAndPlaying: false,
    }),
    components: {
        'radio-selector': RadioSelector,
        'map-display': MapDisplay,
        'covid-header-text': CovidHeaderText,
        'covid-metadata-display': CovidMetadataDisplay,
        'about-this-display': AboutThisDisplay,
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
            let regionIdentifier = getDistributionCheckboxSections(data, filterValueDataElements)[0]
            let regionOptions = regionIdentifier.options
            // let regionIdentifierId = re
            regionOptions.splice(0, 0, {id: "All Regions", text: "All Regions", value: "All Regions"})
            this.regionIdentifierId = regionIdentifier.propertyId
            this.regionOptions = regionOptions
            this.selectedRegion = "All Regions"
            this.dataMapping = mapDistributionData(data)
        }).catch((error) => {
            this.errors.push(error)
        })

        let conceptualDomainPromise = getConceptualDomain().then((data) => {
            this.checkboxSections = [data]
        }).catch((error) => {
            this.errors.push(error)
        })

        let dssPromise = getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            this.errors.push(error)
        })

        // Stop loading once all promises resolved
        Promise.all([dataPromise, distPromise, dssPromise, conceptualDomainPromise]).finally(() => {
            if (this.options.length > 0) {
                this.selectedCategory = this.options[0].value
            }
            this.loading = false;
        })

    },
    watch: {
        selectedCategory: function () {
            this.currentDataElementDefinition = this.$sanitize(this.options.find(obj => {
                return obj.value === this.selectedCategory
            }).definition)
        }
    },
    computed: {
        graphTitle: function() {
            let selectedText = getTextForValue(this.options, this.selectedCategory)
            if (selectedText) {
                return `${selectedText}` // on ${this.formattedDate}`
            }
            // Fallback title
            return 'Covid Map'
        },
        mapData: function () {

            if (!this.dataMapping.has(this.selectedCategory)) {
                return [["Country", "Country name"]]
            }

            let sel = this.dataMapping.get(this.selectedCategory)

            let mapAttributes = [["Country", "Country name", this.camelCaseToSentenceCase(sel)]]

            for (const jsonElement of this.covidData) {

                if (this.sliderDateValue === jsonElement['dateRep'] &&
                    this.checkedTransmissionOptions.includes(jsonElement['transmissionClassification'])
                    // && this.checkedRegionOptions.includes(jsonElement['region'])
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
        updateCheckedOptions: function (opts) {
            this.checkedTransmissionOptions = opts
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
                        this.restartedAndPlaying = false
                    }
                }, 100)
            } else {
                clearInterval(this.timer)
                this.restartedAndPlaying = false
            }
        },
        restartAndPlayMapDates: function () {
            this.restartedAndPlaying = true
            this.sliderDateValue = this.datesData[0]
            setTimeout(() => {
                this.playMapDates()
            }, 600)
        },
    },
}
</script>

<style scoped>
.map-graph-description {
    font-size: 90%;
    margin-left: 5%;
    margin-right: 5%;
}
</style>
