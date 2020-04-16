<template>
    <div class="form-block">
        <label for="select-id">
            {{ description }}
        </label>
        <select id="select-id" name="data element" v-model="selected" @change="updateMap(selected)">
            <option disabled value="">
                {{ blankText }}
            </option>
            <option v-for="o in options" :key="o.value" :value="o.value" :text="o.text">
                {{ o.text }}
            </option>
        </select>
    </div>
</template>

<script>

    // Select form component with v-model support
    export default {
        props: {
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
            selected: "",
        }),
        methods: {
            updateMap: function(selectedOption) {
                this.$emit('changeMap', selectedOption)
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
