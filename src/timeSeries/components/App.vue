<template>
    <div class="root">
        <h1>Aristotle Covid Dashboard</h1>    
        <div class="horizontal-container">
            <bar-graph/>
            <selector/>
        </div>
        <metadata-display/>
    </div>
</template>

<script>
import Selector from './Selector.vue'
import BarGraph from './BarGraph.vue'
import MetadataDisplay from './MetadataDisplay.vue'

// This is the root component for the covid dashboard application
export default {
    components: {
        'selector': Selector,
        'bar-graph': BarGraph,
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
