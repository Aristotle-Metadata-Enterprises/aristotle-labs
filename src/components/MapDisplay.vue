<template>
    <div class="placeholder-bar-graph">
        <GChart
                type="GeoChart"
                :data="mapData"
                :options="chartOptions"
                :settings="{ packages: ['geochart'],}"
        />
    </div>
</template>

<script>
    import { GChart } from 'vue-google-charts'

    export default {
        name: 'MapDisplay',
        components: {
            GChart,
        },
        props: {
            mapData: {
                type: Array,
                default: () => [],
            },
            colorAxisMaxValue: {
                type: Number,
                default: 0,
            }
        },
        data () {
            return {}
        },
        computed: {
            chartOptions: function () {
                return {
                    colorAxis: {
                        colors: ['#ffffff', '#66a6a8', '#668ba8', '#0066ff', '#bc00ff'],
                        maxValue: this.colorAxisMaxValue,
                    },
                    backgroundColor: '#81d4fa',
                    datalessRegionColor: '#d7cece',
                    defaultColor: '#14716e',
                }
            }
        },
    }
</script>

<style>
    .placeholder-bar-graph {
        width: 70%;
        height: 300px;
        background-color: gray;
    }

    .placeholder-bar-graph p {
        text-align: center;
        padding-top: 100px;
    }
</style>
