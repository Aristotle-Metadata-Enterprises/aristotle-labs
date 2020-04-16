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
            }
        },
        data () {
            return {
                chartOptions: {
                    colorAxis: {colors: ['#ffffff', '#0066ff', '#bc00ff']},
                    backgroundColor: '#81d4fa',
                    datalessRegionColor: '#000000',
                    defaultColor: '#14716e',
                    // displayMode: 'markers',
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
