<template>
    <div class="form-block">
        <div v-for="o in options" :key="o">
            <input type="checkbox" :id="o" :value="o" @change="updateCheckedOptions" v-model="checkedOptions">
            <label :for="o">{{ o }}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Filters",
        props: {
            options: {
                type: Array,
                default: () => [],
            }
        },
        data: () => ({
            checkedOptions: []
        }),
        methods: {
            updateCheckedOptions: function () {
                this.$emit('updateCheckedOpt', this.checkedOptions)
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