<template>
    <div class="form-block">
        <p class="font-weight-bold">{{ description }}</p>
        <div class="form-group">
            <ul v-for="o in options">
                <li class="no-dots">
                    <input type="radio" :key="o.value" :value="o.value" :id="o.value" @input="emitInput">
                    <label :for="o.value">{{ o.text }}</label>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>

    // Select form component with v-model support
    export default {
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
