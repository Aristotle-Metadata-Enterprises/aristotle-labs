<script>
    import {Bar} from 'vue-chartjs'
    import { getTextForValue } from '@/utils/options.js'

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
        },
        // Options as an array of objects with value and text properties
        data_element_options: {
            type: Array,
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
                    stacked: true,
                    gridLines: {
                        display: true
                    },
                    scaleLabel: {
                        display: true,
                        labelString: ''
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
                    // Sort, because otherwise bars are randomly floating
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
            this.show()
        }
    },
    methods: {
        // Render the chart based on current data
        show: function() {
            // If chart data isn't empty
            if (Object.keys(this.chartData).length > 0) {
                // Add label to Y Axis
                let yAxisLabel = getTextForValue(this.data_element_options, this.selected[0])
                this.options.scales.yAxes[0].scaleLabel.labelString = yAxisLabel;
                this.renderChart(this.chartData, this.options)
            }
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
            const gradient = ['#7293CB', '#E1974C', '#84BA5B', '#D35E60', '#0000b3', '#004d00']
            // Build the framework that Chart.js expects for stacked datasets
            let datasets = {};
            let position = 0;

            for (let category of categories) {
                if (position > 5) {
                    // Reset to zero if position bigger than gradients, so we don't get index errors
                    position = 0;
                }
                let dataset = {};
                dataset.label = category;
                dataset.backgroundColor = gradient[position]
                dataset.barPercentage = 1.0;
                dataset.categoryPercentage = 1.0;
                dataset.data = {};
                datasets[category] = dataset

                position += 1;
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
                for (let date = new Date(2019, 11, 32); date <= now; date.setDate(date.getDate() + 1)) {
                    if (!(dateValueMap.has(date.getTime()))) {
                        // If the date is not in the map, add it in as a zero valued day
                        dateValueMap.set(date.getTime(), 0 )
                    }
                }
                // Transform back into original dataset
                aggregate.data = Array.from(dateValueMap).reduce((data, [date, value]) => (
                    Object.assign(data, {[new Date(date)]: value})
                ), {});
            });
        }
    }
}
</script>
