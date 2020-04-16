import Vue from 'vue'
import VueRouter from 'vue-router'

import CovidGraphPage from './pages/covid/GraphPage.vue'
import CovidMapPage from './pages/covid/MapPage.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    'routes': [
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
    ]
})

export default router
