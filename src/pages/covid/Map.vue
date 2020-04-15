<template>
    <div class="covid-map">
        <h1>Aristotle Covid Map</h1>    
        <div class="horizontal-container">
            <map-display/>
            <selector/>
        </div>
        <metadata-display/>
    </div>
</template>

<script>
import Selector from '@/components/Selector.vue'
import MapDisplay from '@/components/Map.vue'
import MetadataDisplay from '@/components/MetadataDisplay.vue'

export default {
    components: {
        'selector': Selector,
        'map-display': MapDisplay,
        'metadata-display': MetadataDisplay,
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
