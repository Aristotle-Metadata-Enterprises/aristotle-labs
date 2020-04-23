<template>
    <div class="covid-graph">
        <h1>Aristotle Covid Graph</h1>
        <error-group :errors="errors" />
        <loading v-if="loading" />
        <template v-else>
            <div class="horizontal-container">
                <div>
                    <selector 
                        v-model="selected" 
                        description="Choose a data element" 
                        :options="options" 
                        />
                    <selector 
                        v-model="selectedCategory" 
                        description="Choose a category data element" 
                        :options="categoryOptions"
                        />
                </div>
                <bar-graph :selected="allSelected" :raw_data="raw_data" :distribution_map="distributionDataMap" />
            </div>
            <metadata-display :selected="allSelected" :dss="dss" tooltips />
        </template>
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import ErrorGroup from '@/components/error/ErrorGroup.vue'
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

export default {
    data: () => ({
        distribution: {},
        dss: {},
        raw_data: {},
        selected: '',
        selectedCategory: '',
        options: [],
        categoryOptions: [],
        dataMap: new Map(),
        distributionDataMap: {},
        loading: true,
        errors: [],
    }),
    components: {
        'selector': Selector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
        'error-group': ErrorGroup,
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
            this.loading = false;
        })
    },
    computed: {
        allSelected: function() {
            return [this.selected, this.selectedCategory]
        }
    }
}
</script>

<style>
h1 {
    border-bottom: 1px solid black;
}

.root {
    display: flex;
    flex-direction: column;
}

.horizontal-container {
    display: flex;
    flex-direction: row;
}

.placeholder-metadata {
    margin-top: 50px;
}
</style>
k
