<template>
    <div class="covid-graph mt-3 mb-3">
        <h1 class="text-center">
            COVID-19 Bar Chart
        </h1>
        <hr>
        <loading v-if="loading" />
        <template v-else class="container">
            <h2>{{ graphTitle }}</h2>
            <div class="row">
                <div class="col-sm-9">
                    <bar-graph :selected="allSelected" :raw_data="raw_data" :distribution_map="distributionDataMap" />
                </div>
                <div class="col-sm-3">
                    <div class="card bg-light">
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
            </div>
            <h2 class="text-center">
                How the data was created
            </h2>
            <metadata-display :selected="allSelected" :dss="dss" tooltips />
        </template>
    </div>
</template>

<script>
import RadioSelector from '@/components/RadioSelector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import Loading from '@/components/Loading.vue'
import {
    getCovidData,
    getDistribution,
    getDatasetSpecification,
} from '@/data/covid.js'

import {
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/api.js'
import { getTextForValue } from '@/utils/options.js'

export default {
    data: () => ({
        loading: true,
        distribution: {},
        dss: {},
        raw_data: {},
        selected: '',
        selectedCategory: '',
        options: [],
        categoryOptions: [],
        dataMap: new Map(),
        distributionDataMap: {},
    }),
    components: {
        'radio-selector': RadioSelector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
        'loading': Loading,
    },
    mounted: function() {
        let dataPromise = getCovidData().then((raw_data) => {
            this.raw_data = raw_data;
        }).catch((error) => {
            this.errors.push(error)
        });

        let distPromise = getDistribution().then((data) => {
            this.distribution = data;
            this.options = getDistributionOptions(data, filterNumberDataElements);
            this.categoryOptions = getDistributionOptions(data, filterValueDataElements);
            this.distributionDataMap = mapDistributionData(data)
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
            if (this.options.length > 0) {
                this.selected = this.options[0].value
            }
            if (this.categoryOptions.length > 0) {
                this.selectedCategory = this.categoryOptions[0].value
            }
            this.loading = false;
        })
    },
    computed: {
        graphTitle: function() {
            let selectionText = getTextForValue(this.options, this.selected)
            let categoryText = getTextForValue(this.categoryOptions, this.selectedCategory)
            if (selectionText && categoryText) {
                return `Chart showing ${selectionText} by ${categoryText} over time`
            }
            // Fallback title
            return 'Covid Graph'
        },
        allSelected: function () {
            return [this.selected, this.selectedCategory]
        }
    }
}
</script>
