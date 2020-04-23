<template>
    <div class="form-block">
        <p>
            {{ description }}
        </p>
        <select
                :value="value"
                @input="emitInput"
                class="form-control"
        >
            <option value="">
                {{ blankText }}
            </option>
            <option v-for="o in options" :key="o.value" :value="o.value">
                {{ o.text }}
            </option>
        </select>
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
    .form-block {
        display: block;
        margin: 20px;
    }
</style>
