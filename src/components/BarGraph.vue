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
    import ColorScheme from 'color-scheme';

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
                type: Array,
                required: true,
                default: () => [],
            }
        },
        data() {
            // Data function to return general purpose config
            return {
                options: {
                    scales: {
                        xAxes: [{
                            stacked: true,
                            type: 'time',
                        }],
                        yAxes: [{
                            stacked: true,
                            ticks: {
                                beginAtZero: true
                            },
                            gridLines: {
                                display: false
                            }
                        }]
                    },
                    legend: {
                        display: true
                    },
                    responsive: true,
                    maintainAspectRatio: false
                }
            }
        },
        computed: {
            // Transformed data for display in the bar graph
            chartData: function () {
                // Chart data is a list of points
                if (this.selected[0] && this.selected[1]) {
                    let dataElement = this.selected[0];

                    let categoryDataElement = this.selected[1];
                    categoryDataElement = this.distribution_map.get(categoryDataElement);
                    let categories = this.getCategoriesFromDataElement(categoryDataElement);

                    let dataSet = this.generateDataFramework(categories);
                    // Access key is the lookup key for the JSON field that was selected
                    let accessKey = this.distribution_map.get(dataElement);
                    for (let day of this.raw_data) {
                        // Iterate across the JSON data and add data to each one
                        let aggregate = day[categoryDataElement];
                        if (aggregate) {
                            dataSet[aggregate].data.push(
                                {'t': day['dateRep'], 'y': day[accessKey]}
                            )
                        }
                    }
                    // Return the dataSet as a list of objects, as this is what the object expects
                    return Object.keys(dataSet).map((key) => dataSet[key]);
                }
                return [];
            },
        },
        watch: {
            // Compute graph based on Data Element and VD selections
            selected: function () {
                this.drawBarGraph(this.chartData);
            }
        },
        methods: {
            drawBarGraph: function (chartData) {
                this.renderChart({
                    labels: this.chartLabels,
                    datasets: chartData,
                }, this.options)
            },
            generateRandomColour: function () {
                // Generate colour from colour scheme, so colours are nicely selected
                let scheme = new ColorScheme;
                scheme.from_hue(21).scheme('triade').variation('pastel');
                // Triade scheme generates 12 random colours, return one of them
                return '#' + scheme.colors()[Math.floor(Math.random() * Math.floor(11))].toUpperCase();
            },
            getCategoriesFromDataElement: function (categoryAccessKey) {
                // Return a list of categories from the dataset
                // Used as aggregate for the stacked bar chart
                let categories = this.raw_data.map(day => day[categoryAccessKey]);

                let categorySet = new Set(categories);
                categorySet.delete(undefined);

                return [...categorySet];
            },
            generateDataFramework: function (categories) {
                // Build the framework that Chart.js expects for stacked datasets
                let datasets = {};
                for (let category of categories) {
                    let dataset = {};
                    dataset.label = category;
                    dataset.data = [];
                    dataset.borderColor = '#249EBF';
                    dataset.pointBackgroundColor = 'white';
                    dataset.borderWidth = 1;
                    dataset.pointBorderColor = '#249EBF';
                    dataset.backgroundColor = 'transparent';
                    dataset.backgroundColour = this.generateRandomColour();

                    datasets[category] = dataset
                }
                return datasets;
            }
        }
    }
</script>
