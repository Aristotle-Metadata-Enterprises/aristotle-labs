<template>
    <div class="form-block form-check">
        {{ name }}
        <div v-for="o in options" :key="o.permissibleValueID">
            <input type="checkbox" class="form-check-input" :id="o.permissibleValueID" :value="o.permissibleValueName" @change="updateCheckedOptions" v-model="checkedOptions">
            <label :for="o.permissibleValueID" class="form-check-label">{{ o.permissibleValueName }}</label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CheckboxSection",
        props: {
            name: {
                type: String,
                default: "",
            },
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
                this.$emit('updateCheckedOpt', this.checkedOptions, this.name)
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