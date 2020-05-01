<template>
    <div class="container">
        <div class="row">
            <div class="col-sm-12">
                <div>
                This dashboard provides an interactive display of data about the 2020 <a href="https://registry.aristotlemetadata.com/item/604099/" data-aristotle-concept-id="604099">COVID-19</a> pandemic using data published by the European Centre for Disease Control. This data has been enhanced with metadata from an <a href="https://aristotlemetadata.com">Aristotle Metadata Registry</a>. Hover over the dashboard controls or any <a href="https://registry.aristotlemetadata.com/item/604099/" data-aristotle-concept-id="604099">underlined text</a> to see more information about data, classifications or glossary definitions. Scroll down to read more about how this graph was generated.
                </div>
            </div>
        </div>
        <hr>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import MetadataDisplay from '@/components/MetadataDisplay.vue'

export default {
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
