<template>
    <div class="covid-map">
        <h1>Aristotle Covid Map</h1>
        <div class="horizontal-container">
            <map-display
                    :map-data="mapData"
            />
            <selector
                    description="Choose a data element"
                    :options="options"
                    @changeMap="changeTheMap"
            />
        </div>
        <metadata-display />
    </div>
</template>

<script>

    import Selector from '@/components/Selector.vue'
    import MapDisplay from '@/components/MapDisplay.vue'
    import MetadataDisplay from '@/components/MetadataDisplay.vue'
    import {
        getDistribution,
        getDistributionOptions,
        mapDistributionData,
        filterNumberDataElements,
    } from '@/data/covid.js'
    import axios from "axios";

    export default {
        data: () => ({
            options: [],
            mapData: [['Country'],]
        }),
        components: {
            'selector': Selector,
            'map-display': MapDisplay,
            'metadata-display': MetadataDisplay,
        },
        mounted: function() {
            getDistribution().then((data) => {
                this.distribution = data
                this.options = getDistributionOptions(data, filterNumberDataElements)
                this.datamap = mapDistributionData(data)
            }).catch((error) => {
                // TODO handle errors gracefully
                console.error(error)
            })
        },
        methods: {
            changeTheMap: function (selection) {
                const data_url = 'https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/daily_data.json';
                let sel = this.datamap.get(selection)
                let mapAttributes = [["Country", "Country name", sel]]

                axios.get(data_url).then((data) => {
                    const json = data.data
                    for (const jsonElement of json) {
                    if (jsonElement['year'] === "2020" && jsonElement['month'] === "4" && jsonElement['day'] === "13") {
                        mapAttributes.push([jsonElement['geoId'], jsonElement['reportingArea'], parseInt(jsonElement[sel])])
                    }
                }
                this.mapData = mapAttributes
                }).catch((error) => {

                })
            }
        }
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
