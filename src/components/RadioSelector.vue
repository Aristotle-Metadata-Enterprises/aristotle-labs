<template>
    <div class="form-block">
        <p>
            {{ description }}
        </p>
        <div class="form-check" v-for="o in options" :key="o.value">
            <input class="form-check-input" type="radio" :id="o.value" :value="o.value" @input="emitInput" v-model="picked">
            <label class="form-check-label" :for="o.value" :data-aristotle-concept-id="o.id">{{ o.text }}</label>
        </div>
    </div>
</template>

<script>
// Select form component with v-model support
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import '@aristotle-metadata-enterprises/aristotle_tooltip/dist/tooltip.css'
export default {
    name: "RadioSelector",
    props: {
        // Selected value
        value: {
            type: String,
            default: '',
        },
        // Description of selection
        description: {
            type: String,
            required: true,
        },
        // Text to display when empty
        blankText: {
            type: String,
            default: '----------',
        },
        // Options as an array of objects with value and text properties
        options: {
            type: Array,
            default: () => [],
        }
    },
    data: () => ({
        picked: '',
    }),
    mounted() {
        aristotleTooltip({
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'top',  // TODO: Change this option to 'left' after PR of tooltip selector fix is merged.
        });
    },
    methods: {
        emitInput: function (event) {
            this.$emit('input', event.target.value)
        },
    }
}
</script>

<style scoped>

</style>