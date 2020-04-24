<template>
    <div class="form-block">
        <p class="font-weight-bold">{{ description }}:</p>
        <div class="form-group">
            <ul v-for="o in options">
                <li class="no-dots">
                    <input class="form-check-input" :name="id" type="radio" :key="o.value" :value="o.value"
                           :id="o.value" @input="emitInput">
                    <label class="form-check-label" :for="o.value" :data-aristotle-concept-id="o.id">{{ o.text
                        }}</label>
                </li>
            </ul>
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
        data() {
            return {
                id: null
            }
        },
        mounted() {
            this.id = this._uid;
            // Initialize the aristotle tooltip
            aristotleTooltip({
                'url': 'https://registry.aristotlemetadata.com',
                'definitionWords': 50,
                'longDefinitionWords': 75,
                'placement': 'top'
            })
        },
        methods: {
            emitInput: function (event) {
                this.$emit('input', event.target.value)
            },
        }
    }
</script>

<style scoped>
    .no-dots {
        list-style-type: none;
    }

    .form-block {
        display: block;
        margin: 20px;
    }

    input[type=radio] {
        transform: scale(1.5);
    }
</style>
