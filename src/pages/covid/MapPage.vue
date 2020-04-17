<template>
    <div class="covid-map">
        <h1>Aristotle Covid Map</h1>
        <div class="horizontal-container">
            <map-display
                    :map-data="mapData"
            />
            <selector
                    v-model="selectedCategory"
                    description="Choose a data element"
                    :options="options"
            />
        </div>
        <metadata-display :selected="allSelected" :dss="dss" />
    </div>
</template>

<script>

    import Selector from '@/components/Selector.vue'
    import MapDisplay from '@/components/MapDisplay.vue'
    import MetadataDisplay from '@/components/MetadataDisplay.vue'
    import {
        getCovidData,
        getDistribution,
        getDistributionOptions,
        getDatasetSpecification,
        mapDistributionData,
        filterNumberDataElements,
    } from '@/data/covid.js'

    export default {
        data: () => ({
            dss: {},
            selectedCategory: '',
            options: [],
            dataMapping: new Map()
        }),
        components: {
            'selector': Selector,
            'map-display': MapDisplay,
            'metadata-display': MetadataDisplay,
        },
        mounted: function() {

            getCovidData().then((data) => {
                this.covidData = data
            }).catch((error) => {
                // TODO handle errors gracefully
                console.error(error)
            })

            getDistribution().then((data) => {
                this.distribution = data
                this.options = getDistributionOptions(data, filterNumberDataElements)
                this.dataMapping = mapDistributionData(data)
                console.log("THIS IS THE DATA MAPPING")
                console.log(this.dataMapping)
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
                let sel = this.dataMapping.get(this.selectedCategory)
                if (typeof sel === 'undefined') {
                    return [["Country", "Country name"]]
                }
                let mapAttributes = [["Country", "Country name", this.camelCaseToSentenceCase(sel)]]

                for (const jsonElement of this.covidData) {
                    if (jsonElement['year'] === "2020" && jsonElement['month'] === "4" && jsonElement['day'] === "13") {
                        mapAttributes.push([jsonElement['geoId'], jsonElement['reportingArea'], parseInt(jsonElement[sel])])
                    }
                }
                return mapAttributes
            },
            allSelected: function() {
                return [this.selectedCategory]
            },
        },
        methods: {
            camelCaseToSentenceCase: (text) => {
                let result = text.replace(/[^0-9](?=[0-9])/g, '$& ').replace( /([A-Z])/g, " $1" )
                return result.charAt(0).toUpperCase() + result.slice(1)
            }
        },
    }
</script>

<style>
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

    .placeholder-metadata {
        margin-top: 50px;
    }
</style>
