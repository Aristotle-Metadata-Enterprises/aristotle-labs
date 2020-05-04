import Vue from 'vue'
import VueRouter from 'vue-router'

import CovidGraphPage from './pages/covid/GraphPage.vue'
import CovidMapPage from './pages/covid/MapPage.vue'
import HomePage from './pages/HomePage.vue'

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            'path': '/',
            'name': 'homePage',
            'component': HomePage
        },
        {
            'path': '/covid/graph/',
            'name': 'covidGraph',
            'component': CovidGraphPage
        },
        {
            'path': '/covid/map/',
            'name': 'covidMap',
            'component': CovidMapPage
        },
    ],
    scrollBehavior: function() {
        // Scroll to top when changing routes
        return {x: 0, y: 0}
    }
})

export default router
