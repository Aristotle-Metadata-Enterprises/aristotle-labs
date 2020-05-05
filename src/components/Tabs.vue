<template>
    <ul class="nav nav-tabs">
        <li class="nav-item">
            <a class="nav-link" :class="{ 'active': !graphTabActive}" href="#/covid/map">Map view</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" :class="{ 'active': graphTabActive}" href="#/covid/graph">Graph view</a>
        </li>
    </ul>
</template>

<script>
export default {
    name: "Tabs",
    props: {
        graphTabActive: {
            type: Boolean,
            default: false,
        }
    }
}
</script>

<style scoped>

</style>