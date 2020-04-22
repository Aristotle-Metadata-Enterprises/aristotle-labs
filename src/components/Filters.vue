<template>
    <div class="form-block form-check">
        <div v-for="o in options" :key="o">
            <input type="checkbox" class="form-check-input" :id="o" :value="o" @change="updateCheckedOptions" v-model="checkedOptions">
            <label :for="o" class="form-check-label">{{ o }}</label>
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