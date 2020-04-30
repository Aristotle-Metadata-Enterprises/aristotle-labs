<template>
    <div class="root">
        <custom-header />
        <div class="content-container container-main">
            <router-view />
        </div>
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
html, body {
    min-height: 100vh;
    height: 100%;
}

body {
    display: -ms-flexbox;
    display: flex;
    flex-direction: column;
}

.content-container {
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

.container-main {
    flex-grow: 2;
}

.aristotle-logo {
    margin-top: 5px;
}
</style>
