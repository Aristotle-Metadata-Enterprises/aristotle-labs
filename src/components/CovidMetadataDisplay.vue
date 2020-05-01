<template>
    <div>
        <h2 class="text-center">
            How the data was created
        </h2>
        <div class="container before">
            <p>
                The diagram below shows information about how the data above was collected and transformed before it was published. A record of how data was collected and how it has changed is called <a href="https://en.wikipedia.org/wiki/Data_lineage"><dfn>data lineage</dfn></a> and is an important part of reporting as it tells people where data has come from. <dfn>Metadata</dfn> is an important part of recording <dfn>data lineage</dfn> by making sure that transformations and fields are recorded in a way is managed and accessible.
            </p>
        </div>
        <metadata-display :selected="selected" :dss="dss" tooltips />
        <div class="container after">
            <p>This diagram is updated dynamically from the metadata to show how the selected data was collected and transformed before being displayed on the above graph. Hover over any of the boxes for more information about where this data came from and how it changed over time.</p>
        </div>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import MetadataDisplay from '@/components/MetadataDisplay.vue'

export default {
    props: {
        // Dss graphql data
        dss: {
            type: Object,
            required: true,
        },
        // uuid's of selected elements to display in graph
        // Falsy elements will be ignored
        selected: {
            type: Array,
            default: () => [],
        },
    },
    components: {
        'metadata-display': MetadataDisplay,
    },
}
</script>

<style scoped>
    .before {
        margin-top:40px
    }
    .after {
        margin-top:40px
    }
</style>
