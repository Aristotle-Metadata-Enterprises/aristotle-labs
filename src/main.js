import Vue from 'vue'

import Router from './router.js'
import App from './App.vue'

new Vue({
    el: '#app',
    router: Router,
    render: h => h(App)
})
