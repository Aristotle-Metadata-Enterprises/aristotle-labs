<template>
    <div class="root">
        <custom-header />
        <main>
            <router-view />
        </main>
        <custom-footer />
    </div>
</template>

<script>
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'

export default {
    components: {
        'custom-header': Header,
        'custom-footer': Footer,
    }
}
</script>

<style scoped>
main {
    flex-grow: 2;
    width: 80%;
    margin-left: auto;
    margin-right: auto;
}

.root {
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
    height: 100%
}

.aristotle-logo {
    margin-top: 5px;
}
</style>
