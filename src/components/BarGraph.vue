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
    data: () => ({
        options: {
            scales: {
                xAxes: [{
                    type: 'time',
                    stacked: true
                }],
                yAxes: [{
                    stacked: true,
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
                        dataSets[aggregate].data.push(
                            {'t': recordDate, 'y': Number(day[accessKey])}
                        )
                    }
                }
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
        generateChartDataFramework: function (categories) {
            // Build the framework that Chart.js expects for stacked datasets
            let datasets = {};
            for (let category of categories) {
                let dataset = {};
                dataset.label = category;
                dataset.backgroundColor = this.generateRandomColour();
                dataset.data = [];
                datasets[category] = dataset
            }
            return datasets;
        }
    }
}
</script>