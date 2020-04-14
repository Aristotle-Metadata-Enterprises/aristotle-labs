import Vue from 'vue'
import VueRouter from 'vue-router'

import CovidGraph from './pages/CovidGraph.vue'
import CovidMap from './pages/CovidMap.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    'routes': [
        {
            'path': '/covid/graph/',
            'name': 'covidGraph',
            'component': CovidGraph
        },
        {
            'path': '/covid/map/',
            'name': 'covidMap',
            'component': CovidMap
        },
    ]
})

export default router
