<template>
    <div>
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
        },
        region: {
            type: String,
            default: ''
        },
    },
    data () {
        return {}
    },
    computed: {
        chartOptions: function () {
            let options = {
                colorAxis: {
                    colors: ['#d9ffd0', '#7fd26c', '#f4ef5b', '#f47c7c'],
                    maxValue: this.colorAxisMaxValue,
                    minValue: 0,
                },
                backgroundColor: '#81d4fa',
                datalessRegionColor: '#ffffff',
                defaultColor: '#ff74ea',
            }
            if (this.region && this.region !== "All Regions") {
                options.region = this.region
            }
            return options
        }
    },
}
</script>

<style scoped>
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
