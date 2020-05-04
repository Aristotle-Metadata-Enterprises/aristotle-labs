<template>
    <div ref="container" class="form-block">
        <div class="font-weight-bold" :data-aristotle-concept-id="descriptionId">
            {{ description }}
        </div>
        <div v-if="help" class="help">
            {{ help }}
        </div>
        <div ref="option" class="form-check" v-for="o in options" :key="o.value" :data-aristotle-concept-id="o.aristotleTooltipId">
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
        // Help text of selection
        help: {
            type: String,
            required: false,
            default: '',
        },
        // Options as an array of objects with value and text properties
        options: {
            type: Array,
            default: () => [],
        },
        descriptionId: {
            type: String,
            default: undefined,
        },
        // Add a tooltip for the radio options.
        tooltipForOptions: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        // Initialize the aristotle tooltip
        aristotleTooltip({
            'selector': this.$refs.container,
            'url': 'https://registry.aristotlemetadata.com',
            'definitionWords': 50,
            'longDefinitionWords': 75,
            'placement': 'left',
        })
    },
    methods: {
        emitInput: function (event) {
            this.$emit('input', event.target.value)
        },
    },
}
</script>

<style scoped>
.form-block {
    display: block;
    margin: 10px 20px;
}
input[type=radio] {
    transform: scale(1.25);
}
.help {
    font-size: 90%;
}
</style>
