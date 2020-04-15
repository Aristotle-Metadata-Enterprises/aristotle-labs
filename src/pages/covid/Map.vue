<template>
    <div class="covid-map">
        <h1>Aristotle Covid Map</h1>    
        <div class="horizontal-container">
            <map-display/>
            <selector 
                v-model="selected" 
                description="Choose a data element" 
                :options="options" 
            />
        </div>
        <metadata-display/>
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import MapDisplay from '@/components/Map.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'
import {
    getDistribution,
    getDistributionOptions,
    mapDistributionData,
    filterNumberDataElements,
} from '@/data/covid.js'

export default {
    data: () => ({
        selected: '',
        options: [],
    }),
    components: {
        'selector': Selector,
        'map-display': MapDisplay,
        'metadata-display': MetadataDisplay,
    },
    mounted: function() {
        getDistribution().then((data) => {
            this.distribution = data
            this.options = getDistributionOptions(data, filterNumberDataElements)
            this.datamap = mapDistributionData(data)
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
