<template>
    <div class="placeholder-bar-graph">
        <GChart
                type="GeoChart"
                :data="chartData"
                :options="chartOptions"
                :settings="{ packages: ['geochart'],  }"
        />
    </div>
</template>

<script>
    import { GChart } from 'vue-google-charts'

    export default {
        name: 'Map',
        components: {
            GChart,
        },
        data () {
            return {
                // Array will be automatically processed with visualization.arrayToDataTable function
                chartData: [
                    ['Country', 'Popularity'],
                    ['Germany', 200],
                    ['US', 300],
                    ['Brazil', 400],
                    ['Canada', 500],
                    ['France', 600],
                    ['RU', 700]
                ],
                chartOptions: {
                    chart: {
                        title: 'Company Performance',
                        subtitle: 'Sales, Expenses, and Profit: 2014-2017',
                    }
                }
            }
        },
        // computed: {
        //     getLatestData: function () {
        //
        //     }
        // },
        created() {
            console.log("hello world")
            const json = require('../daily_data_recent.json');
            console.log(json)
            console.log("THIS IS THE CURRENT DATA")
            console.log(this.data)
        }
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
