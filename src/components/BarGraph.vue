<template>
    <div class="placeholder-bar-graph">
        <p>Bar graph goes here</p>
    </div>
</template>

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
<script>
    import {Bar} from 'vue-chartjs'

    export default {
        extends: Bar,
        props: {
            // The raw JSON COVID-19 case data
            raw_data: {
                type: Array | Object,
                required: false
            },
            // A map of the UUID of the Data Element to the lookup key in the raw data
            distribution_map: {
                type: Object | Map,
                required: true
            },
            // The set of selections from the two select boxes
            selected: {
                type: Set,
                required: true
            }
        },
        data() {
            // Data function to return general purpose config
            return {
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: false
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },
        computed: {
            // Transformed data for display in the bar graph
            chartData: function () {
                // Chart data is a list
                console.log(this.selected)
            }
        },
        watch: {
            // Compute graph based on Data Element and VD selections
            selected: function (selected) {
                this.drawBarGraph(selected)
            }
        },
        methods: {
            drawBarGraph: function (selected) {
                this.renderChart({
                    labels: this.chartLabels,
                    datasets: [
                        {
                            label: this.chartLabel,
                            borderColor: '#249EBF',
                            pointBackgroundColor: 'white',
                            borderWidth: 1,
                            pointBorderColor: '#249EBF',
                            backgroundColor: 'transparent',
                            data: this.chartData
                        }
                    ]
                }, this.options)
            }
        },
    }
</script>
