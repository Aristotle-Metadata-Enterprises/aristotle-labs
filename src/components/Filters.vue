<template>
    <div class="form-block">

        <div v-for="o in options" :key="o">
            <label :for="o">{{ o }}</label>
            <input type="checkbox" :id="o" :value="o">
        </div>

<!--        <span>Checked names: {{  }}</span>-->
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
    }
</script>

<style scoped>
    .form-block {
        display: block;
        margin: 20px;
    }
</style>