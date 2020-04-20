<template>
    <div class="covid-graph">
        <h1>Aristotle Covid Graph</h1>    
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
        <metadata-display :selected="allSelected" :dss="dss" />
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import {
    getCovidData,
    getDistribution,
    getDistributionOptions,
    getDatasetSpecification,
    mapDistributionData,
    filterNumberDataElements,
    filterValueDataElements,
} from '@/data/covid.js'

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
        'selector': Selector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
    },
    mounted: function() {
        getCovidData().then((raw_data) => {
            this.raw_data = raw_data;
        }).catch((error) =>
        {
            // TODO: handle errors gracefully
            console.log(error)
        });
        getDistribution().then((data) => {
            this.distribution = data;
            this.options = getDistributionOptions(data, filterNumberDataElements);
            this.categoryOptions = getDistributionOptions(data, filterValueDataElements);
            this.distributionDataMap = mapDistributionData(data)
        }).catch((error) => {
            // TODO handle errors gracefully
            console.error(error)
        })

        getDatasetSpecification().then((data) => {
            this.dss = data
        }).catch((error) => {
            // TODO handle errors gracefully
            console.error(error)
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