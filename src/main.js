import Vue from 'vue'

import Router from './router.js'
import App from './App.vue'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

new Vue({
    el: '#app',
    router: Router,
    render: h => h(App)
})
