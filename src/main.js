import Vue from 'vue'

import Router from './router.js'
import App from './App.vue'
import VueSanitize from "vue-sanitize"

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import '@/styles/global.css'

new Vue({
    el: '#app',
    router: Router,
    render: h => h(App)
})
let defaultOptions = {
    allowedTags: [],
    allowedAttributes: {
    }
};
Vue.use(VueSanitize, defaultOptions)
