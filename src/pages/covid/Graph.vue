<template>
    <div class="covid-graph">
        <h1>Aristotle Covid Graph</h1>    
        <div class="horizontal-container">
            <bar-graph />
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
        </div>
        <metadata-display />
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import BarGraph from '@/components/BarGraph.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import {
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
        selected: '',
        selectedCategory: '',
        options: [],
        categoryOptions: [],
        dataMap: new Map(),
    }),
    components: {
        'selector': Selector,
        'bar-graph': BarGraph,
        'metadata-display': MetadataDisplay,
    },
    mounted: function() {
        getDistribution().then((data) => {
            this.distribution = data
            this.options = getDistributionOptions(data, filterNumberDataElements)
            this.categoryOptions = getDistributionOptions(data, filterValueDataElements)
            this.datamap = mapDistributionData(data)
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
