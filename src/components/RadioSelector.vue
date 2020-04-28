<template>
    <div class="form-block">
        <span class="font-weight-bold">
            {{ description }}
        </span>
        <div class="form-check" v-for="o in options" :key="o.value" :data-aristotle-concept-id="o.id">
            <input class="form-check-input" type="radio" :id="o.value" :value="o.value" :checked="o.value === value" @change="emitInput">
            <label class="form-check-label" :for="o.value">{{ o.text }}</label>
        </div>
    </div>
</template>

<script>
import aristotleTooltip from '@aristotle-metadata-enterprises/aristotle_tooltip'
import '@aristotle-metadata-enterprises/aristotle_tooltip/dist/tooltip.css'
// Radio buttons with v-model support
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
        // Options as an array of objects with value and text properties
        options: {
            type: Array,
            default: () => [],
        }
    },
    mounted() {
        // Initialize the aristotle tooltip
        aristotleTooltip({
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'left',
        });
    },
    methods: {
        emitInput: function (event) {
            this.$emit('updateInput', event.target.value)
        },
    },
}
</script>

<style scoped>
.form-block {
    display: block;
    margin: 20px;
}
input[type=radio] {
    transform: scale(1.25);
}
</style>
