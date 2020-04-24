<template>
    <div class="covid-graph">
        <h1 class="text-center">COVID-19 Bar Chart</h1>
        <div class="container padding-above-2x">
            <div class="row">
                <div class="col-sm-9">
                    <bar-graph :selected="allSelected" :raw_data="raw_data" :distribution_map="distributionDataMap"/>
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
            <metadata-display :selected="allSelected" :dss="dss" tooltips class="padding-below"/>
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
    }),
    components: {
        'radio-selector': RadioSelector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
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
        allSelected: function () {
            return [this.selected, this.selectedCategory]
        }
    }
}
</script>

<style>
    .padding-above {
        margin-top: 20px;
    }

    .padding-above-2x {
        margin-top: 40px;
    }

    .padding-below {
        margin-bottom: 20px;
    }
</style>
