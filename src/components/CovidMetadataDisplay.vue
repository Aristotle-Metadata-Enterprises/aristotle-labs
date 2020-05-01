<template>
    <div>
        <h2 class="text-center">
            How the data was created
        </h2>
        <div class="container" style="margin-bottom:40px;">
            <p>
                The diagram below shows information about how the data above was collected and transformed before it was published. A record of how data was collected and how it has changed is called <em>data lineage</em> and is an important part of reporting as it tells users where data has come from. <em>Metadata</em> is an important part of recording <em>data lineage</em> by making sure that transformations and fields are available .
            </p>
        </div>
        <metadata-display :selected="selected" :dss="dss" tooltips />
        <div class="container" style="margin-bottom:40px;">
            <p>This diagram is updated dynamically from the metadata to show how the selected data was collected and transformed before being displayed on the above graph. Hover over any of the boxes for more information about where this data came from and how it changed over time.</p>
            <div class="h4 text-center">How metadata keeps data accessible and protected</div>
            <p>
            On this dashboard, the <a href="https://registry.aristotlemetadata.com/item/603889/" data-aristotle-concept-id="603889">source data collected</a> (left) by the
            <a href="https://who.int">World Health Organisation</a> is sensitive information about individuals, however the <a>data collection forms</a> are made available.
            Because the metadata about how the data is collected is published, we can trace all of the transformations to the data before being grouped and
            <a href="https://registry.aristotlemetadata.com/item/604036/" data-aristotle-concept-id="604036">published at a country level</a> (right).
            </p>
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
    mounted: function() {
        aristotleTooltip({
            'selector': this.$refs.block,
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'bottom',
        });
    }
}
</script>

<style>
</style>
