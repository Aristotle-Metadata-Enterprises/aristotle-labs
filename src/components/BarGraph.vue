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
                    // ticks: {
                    //     beginAtZero: true,
                    // },
                    stacked: true,
                    gridLines: {
                        display: true
                    }
                }]
            },
            legend: {
                position: 'bottom',
            },
            responsive: true,
            maintainAspectRatio: false
        }
    }),
    mounted: function() {
        this.show()
    },
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
                this.fillMissingDates(dataSets);

                // Transform data in datasets to fit format to expected Chart JS format
                Object.values(dataSets).forEach(aggregate => {
                    aggregate.data = Object.keys(aggregate.data).map(date => (
                        {"t": date, "y": aggregate.data[date]}
                    ));
                    // Sort, because other bars are randomly floating
                    aggregate.data  = aggregate.data.sort(function(a, b) {
                        let dateA = new Date(a["t"]); let dateB = new Date(b["t"]);
                        return dateA - dateB;
                        }
                    )
                });
                // Return the dataSet as a list of objects, as this is what chartData expects
                let transformedDataSets = Object.keys(dataSets).map((key) => dataSets[key]);
                return {
                    datasets: transformedDataSets,
                    labels: []
                }
            }
            return {}
        }
    },
    watch: {
        selected: function () {
            this.fillMissingDates([])
            let chartData = this.chartData;
            this.renderChart(chartData, this.options)
            this.show()
        }
    },
    methods: {
        // Render the chart based on current data
        show: function() {
            // If chart data isnt empty
            if (Object.keys(this.chartData).length > 0) {
                this.renderChart(this.chartData, this.options)
            }
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
        },
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
                datasets[category] = dataset
            }
            return datasets;
        },
        fillMissingDates: function (dataSets) {
            // Data begins on the 31st of December, and continues to the present day
            // but we'll fill it in only to the previous day, so we don't get caught out
            // if the lambda hasn't been run
            let now = new Date()
            now = now.setDate(now.getDate() - 1)

            Object.values(dataSets).forEach(aggregate => {
                let dateValueMap = new Map();

                // Build a Map of timestamp -> value
                for (let [date, value] of Object.entries(aggregate.data)) {
                    dateValueMap.set(new Date(date).getTime(), value)
                }
                // Add missing days into dataset
                for (let date = new Date(2019, 11, 311); date <= now; date.setDate(date.getDate() + 1)) {
                    if (!(date.getTime() in dateValueMap)) {
                        // If the date is not in the map, add it in as a zero valued day
                        dateValueMap.set(date.getTime(), 0 )
                    }
                }
                // Transform back into original dataset
                let data = Array.from(dateValueMap).reduce((data, [date, value]) => (
                    Object.assign(data, {[new Date(date)]: value}) // Be careful! Maps can have non-String keys; object literals can't.
                ), {});
                aggregate.data = data;
            });
        }
    }
}
</script>
