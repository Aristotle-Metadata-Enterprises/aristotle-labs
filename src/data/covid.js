// Covid data access functions to be used across vue components
import axios from 'axios'

import { queryDistribution, queryDss, queryConceptualDomain } from '@/data/api.js'
import { NiceError } from '@/error/class.js'

// Get the COVID-19 data and transform into JavaScript object
export function getCovidData() {
    const data_url = 'https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/daily_data.json';
    return axios.get(data_url).then((response) => {
       return response.data
    }).catch((error) => {
        throw new NiceError('Could not fetch virus data', error)
    })
}

// Query covid distribution data
export function getDistribution() {
    // Identifier for covid distribution
    const uuid = "11c5d3ac-73d0-11ea-9c38-02d94c4bd698"
    return queryDistribution(uuid)
}

export function getConceptualDomain() {
    const aristotleId = "604037"
    return queryConceptualDomain(aristotleId)
}

/**
 * The purpose of this function is to get the distribution options for the checkboxes in the map page.
 * @param distribution
 * @param filter string
 * @returns {*}
 */
export function getDistributionCheckboxSections(distribution, filter) {
    let checkboxSections = []
    for (let dep of distribution.distributiondataelementpathSet) {
        if (filter && !filter(dep.dataElement)) {
            continue
        }
        let sectionOptions = []
        for (let permissibleValue of dep.dataElement.valueDomain.permissiblevalueSet) {
            if (permissibleValue.valueMeaning) {
                sectionOptions.push({
                    id: permissibleValue.valueMeaning.id,
                    value: permissibleValue.valueMeaning.name,
                    text: permissibleValue.valueMeaning.name,
                })
            } else {
                if (permissibleValue.meaning === 'African Region') {
                    permissibleValue.value = '002'
                }
                if (permissibleValue.meaning === 'Region of the Americas') {
                    permissibleValue.value = '019'
                }
                if (permissibleValue.meaning === 'South-East Asia Region') {
                    permissibleValue.value = '035'
                }
                if (permissibleValue.meaning === 'European Region') {
                    permissibleValue.value = '150'
                }
                if (permissibleValue.meaning === 'Eastern Mediterranean Region') {
                    permissibleValue.value = '145'
                }
                if (permissibleValue.meaning === 'Western Pacific Region') {
                    permissibleValue.value = '009'
                }
                sectionOptions.push({
                    id: permissibleValue.id,
                    value: permissibleValue.value,
                    text: permissibleValue.meaning,
                    aristotleTooltipId: null,
                })
            }
        }
        checkboxSections.push({
            propertyId: dep.dataElement.dataElementConcept.property.aristotleId,
            propertyUUID: dep.dataElement.dataElementConcept.property.uuid,
            propertyName: dep.dataElement.dataElementConcept.property.name,
            options: sectionOptions,
        })
    }
    return checkboxSections
}

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
