<template>
    <div class="covid-graph">
        <h1>
            Aristotle COVID-19 Bar Chart
        </h1>
        <div class="container-fluid padding-above-2x">
            <div class="row">
                <div class="col-md-8 col-12">
                    <bar-graph :chart-data="graphData" />
                </div>
                <div class="col-md-4 col-12">
                    <radio-selector
                            v-model="selected"
                            description="Choose a data element"
                            :options="options"
                    />
                    <radio-selector
                            v-model="selectedCategory"
                            description="Choose a category data element"
                            :options="categoryOptions"
                    />
                </div>
            </div>
<!--            <metadata-display :selected="allSelected" :dss="dss" tooltips class="mb-4" />-->
        </div>
    </div>
</template>

<script>
import RadioSelector from '@/components/RadioSelector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import {
    getCovidData,
    getDistribution,
    getDistributionCheckboxSections,
    getDatasetSpecification,
} from '@/data/covid.js'

import {
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/api.js'
import ColorScheme from "color-scheme"

export default {
    data: () => ({
        distribution: {},
        dss: {},
        selected: '',
        selectedCategory: '',
        options: [],
        categoryOptions: [],
        dataMap: new Map(),
        dataMapping: {},
    }),
    components: {
        'radio-selector': RadioSelector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
    },
    beforeCreate: function() {
        let dataPromise = getCovidData().then((data) => {
            this.covidData = data

        }).catch((error) => {
            this.errors.push(error)
        });

        let distPromise = getDistribution().then((data) => {
            this.distribution = data
            this.options = getDistributionOptions(data, filterNumberDataElements)
            this.selected = this.options[0].value
            this.categoryOptions = getDistributionOptions(data, filterValueDataElements)
            this.selectedCategory = this.categoryOptions[0].value
            // TODO: Rename this function since these are not checkboxes:
            this.checkboxSections = getDistributionCheckboxSections(data, filterValueDataElements)
            this.dataMapping = mapDistributionData(data)
        }).catch((error) => {
            this.errors.push(error)
        })

        let dssPromise = getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            this.errors.push(error)
        })

        // Stop loading once all promises resolved
        Promise.all([dataPromise, distPromise, dssPromise]).finally(() => {
            this.loading = false
        })
    },
    computed: {
        allSelected: function () {
            return [this.selected, this.selectedCategory]
        },
        graphData: function () {
            // Chart data is a list of datasets
            if (this.selected && this.selectedCategory) {

                let categoryDataElement = this.dataMapping.get(this.selectedCategory)
                // Access key is the lookup key for the JSON field that was selected
                let accessKey = this.dataMapping.get(this.selected)
                if (!this.dataMapping.has(this.selectedCategory)) {
                    return {}
                }
                if (this.covidData == null) {
                    return {}
                }

                if (Object.keys(this.covidData).length === 0) {
                    return {}
                }
                console.log("THESE ARE THE CATEGORY OPTIONS")
                console.log(this.categoryOptions)
                console.log("THIS IS THE SELECTED CATEGORY")
                console.log(this.selectedCategory)
                let categories = []
                for (let section of this.checkboxSections) {
                    // if (section.propertyName === this.selectedCategory)
                    console.log("THIS IS THE SECTION")
                    console.log(section)
                    // categories.push(option.text)
                }
                console.log(categories)
                // let categories = this.getCategoriesFromDataElement(this.selectedCategory)
                console.log("THESE ARE THE CATEGORIES")
                console.log(categories)
                let dataSets = this.generateChartDataFramework(categories)

                for (let day of this.covidData) {
                    // Iterate across the JSON data and add data to each one
                    let aggregate = day[categoryDataElement]
                    if (aggregate) {
                        let recordDate = new Date(day['year'], day['month'] - 1, day['day'])
                        dataSets[aggregate].data.push(
                            {'t': recordDate, 'y': Number(day[accessKey])}
                        )
                    }
                }
                // Return the dataSet as a list of objects, as this is what chartData expects
                let transformedDataSets = Object.keys(dataSets).map((key) => dataSets[key])
                return {
                    datasets: transformedDataSets,
                    labels: []
                }
            }
            return {datasets: {}, labels: []}
        },
    },
    methods: {
        generateRandomColour: function () {
            // Generate colour from colour scheme, so colours are nicely selected
            let scheme = new ColorScheme;
            scheme.from_hue(21).scheme('triade').variation('pastel')
            // Triade scheme generates 12 random colours, return one of them
            return '#' + scheme.colors()[Math.floor(Math.random() * Math.floor(11))].toUpperCase()
        },
        getCategoriesFromDataElement: function (categoryAccessKey) {
            // Return a list of categories from the dataset
            // Used as aggregate for the stacked bar chart
            console.log("THIS IS THE COVID DATA")
            console.log(this.covidData)
            let categories = this.covidData.map((day) => day[categoryAccessKey])
            console.log("CATEETTTT")
            console.log(categoryAccessKey)
            console.log(categories)

            let categorySet = new Set(categories)
            categorySet.delete(undefined)

            return [...categorySet]
        },
        generateChartDataFramework: function (categories) {
            // Build the framework that Chart.js expects for stacked datasets
            let datasets = {}
            for (let category of categories) {
                let dataset = {}
                dataset.label = category;
                dataset.backgroundColor = this.generateRandomColour()
                dataset.data = []

                datasets[category] = dataset
            }
            return datasets
        },
    },
}
</script>

<style>
.padding-above {
    margin-top: 20px;
}

.padding-above-2x {
    margin-top: 40px;
}

</style>
