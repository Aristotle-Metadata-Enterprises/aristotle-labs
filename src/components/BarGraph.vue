<script>
    import {Bar} from 'vue-chartjs'
    import gradstop from 'gradstop';

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
        data: () => ({
            options: {
                scales: {
                    xAxes: [{
                        type: 'time',
                        stacked: true,
                        ticks: {
                            beginAtZero: true
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        },
                        gridLines: {
                            display: true
                        }
                    }]
                },
                responsive: true,
                maintainAspectRatio: false
            }
        }),
        computed: {
            // Transformed data for display in the bar graph
            chartData: function () {
                // Chart data is a list of datasets
                if (this.selected[0] && this.selected[1]) {
                    let dataElement = this.selected[0];

                    let categoryDataElement = this.selected[1];
                    categoryDataElement = this.distribution_map.get(categoryDataElement);
                    let categories = this.getCategoriesFromDataElement(categoryDataElement);
                    let dataSets = this.generateChartDataFramework(categories);

                    // Access key is the lookup key for the JSON field that was selected
                    let accessKey = this.distribution_map.get(dataElement);

                    for (let day of this.raw_data) {
                        // Iterate across the JSON data and add data to each one
                        let aggregate = day[categoryDataElement];
                        if (aggregate) {
                            let recordDate = new Date(day['year'], day['month'] - 1, day['day']);
                            if (dataSets[aggregate].data[recordDate]) {
                                dataSets[aggregate].data[recordDate] += Number(day[accessKey])
                            } else {
                                // If it doesn't exist, add it in
                                dataSets[aggregate].data[recordDate] = Number(day[accessKey])
                            }
                        }
                    }
                    // Transform data in datasets to fit format to expected Chart JS format
                    Object.values(dataSets).forEach(aggregate => {
                        aggregate.data = Object.keys(aggregate.data).map(date => (
                            {"t": date, "y": aggregate.data[date]}
                        ));
                    });
                    // Return the dataSet as a list of objects, as this is what chartData expects
                    let transformedDataSets = Object.keys(dataSets).map((key) => dataSets[key]);
                    return {
                        datasets: transformedDataSets,
                        labels: []
                    }
                }
            }
        },
        watch: {
            selected: function () {
                let chartData = this.chartData;
                this.renderChart(chartData, this.options)
            }
        },
        methods: {
            componentToHex: function (c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            },
            rgbToHex: function (rgbto) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            },
            generateRandomColour: function () {
                // Generate colour from colour scheme, so colours are nicely selected
                const gradient = gradstop({
                    stops: 10,
                    inputFormat: 'hex',
                    colorArray: ['#115fd4', '#ff0000']
                });
                return gradient[Math.floor(Math.random() * 9)];
            },
            getCategoriesFromDataElement: function (categoryAccessKey) {
                // Return a list of categories from the dataset
                // Used as aggregate for the stacked bar chart
                let categories = this.raw_data.map(day => day[categoryAccessKey]);

                let categorySet = new Set(categories);
                categorySet.delete(undefined);

                return [...categorySet];
            }
            ,
            generateChartDataFramework: function (categories) {
                // Build the framework that Chart.js expects for stacked datasets
                let datasets = {};
                for (let category of categories) {
                    let dataset = {};
                    dataset.label = category;
                    dataset.backgroundColor = this.generateRandomColour();
                    dataset.barPercentage = 1.0;
                    dataset.categoryPercentage = 1.0;
                    dataset.data = {};
                    dataset.stack = "same"

                    datasets[category] = dataset
                }
                return datasets;
            }
        }
    }
</script>