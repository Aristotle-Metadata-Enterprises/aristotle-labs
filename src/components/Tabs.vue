<template>
    <ul class="nav nav-tabs mt-4 mb-4">
        <li class="nav-item" v-for="tab in tabs" :key="tab.name">
            <router-link class="nav-link" :class="{ 'active': tab.active}" :to="{name: tab.link}">
                {{ tab.name }}
            </router-link>
        </li>
    </ul>
</template>

<script>
export default {
    name: "Tabs",
    props: {
        tabs: {
            type: Array,
            default: () => [],
        },
    },
}
</script>

<style scoped>

</style>