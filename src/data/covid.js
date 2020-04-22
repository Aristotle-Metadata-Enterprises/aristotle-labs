// Covid data access functions to be used across vue components
import axios from 'axios'

import { queryDistribution, queryDss } from '@/data/api.js'

// Get the COVID-19 data and transform into JavaScript object
export function getCovidData() {
    const data_url = 'https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/daily_data.json';
    return axios.get(data_url).then((response) => {
       return response.data
    }).catch((response) => {
        console.log(response)
    })
}

// Query covid distribution data
export function getDistribution() {
    // Identifier for covid distribution
    const uuid = "11c5d3ac-73d0-11ea-9c38-02d94c4bd698"
    return queryDistribution(uuid)
}

/**
 * The purpose of this function is to get the filter options for the map page.
 * @param data
 * @param filterName string
 * @returns {*}
 */
export function getMapFilterOptions(data, filterName) {
    let options = new Set()
    for (const option of data) {
        if (typeof option[filterName] !== 'undefined') {
            options.add(option[filterName])
        }
    }
    return [...options]
}

// Query covid dataset specification data
export function getDatasetSpecification() {
    // Identifier for covid dss
    const uuid = "f8cf638e-6cc4-11ea-9034-02f12b5fb674"
    return queryDss(uuid)
}
