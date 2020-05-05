<template>
    <ul class="nav nav-tabs mt-4 mb-4">
        <li class="nav-item" v-for="ta in tabs" :key="ta.name">
            <a class="nav-link" :class="{ 'active': ta.active}" :href="ta.link">
                {{ ta.name }}
            </a>
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
        }
    }
}
</script>

<style scoped>

</style>