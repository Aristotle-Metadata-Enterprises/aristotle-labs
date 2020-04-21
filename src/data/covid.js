// Covid data access functions to be used across vue components
/* global process */
import axios from 'axios'

// Get the COVID-19 data and transform into JavaScript object
export function getCovidData() {
    const data_url = 'https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/daily_data.json';
    return axios.get(data_url).then((response) => {
       return response.data
    }).catch((response) => {
        console.log(response)
    })
}

// Perform a graphql query on the aristotle registry
function graphqlQuery(query, variables) {
    // Url for our registries graphql endpoint
    const graphql_url = 'https://registry.aristotlemetadata.com/api/graphql/json'
    // Auth headers for api requests
    // TODO remove once metadata is public
    const headers = {'Authorization': `Token ${process.env.TOKEN}`}

    const query_obj = {query: query, variables: variables}
    return axios.post(graphql_url, query_obj, {headers: headers})
}

// Query covid distribution data
export function getDistribution() {
    // Identifier for covid distribution
    const uuid = "11c5d3ac-73d0-11ea-9c38-02d94c4bd698"
    const query = `
    query ($uuid: UUID) {
      distributions (uuid: $uuid) {
        edges {
          node {
            name
            distributiondataelementpathSet {
              logicalPath
              dataElement {
                name
                uuid
                valueDomain {
                  uuid
                  dataType {
                    name
                  }
                  permissiblevalueSet {
                    value
                  }
                }
                dataElementConcept{
                  property {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }`

    return graphqlQuery(query, {uuid: uuid}).then((response) => {
        return response.data.data.distributions.edges[0].node
    })
}

// Get a distributions data elements as options array
// Filter is an optional function that receives a data element and returns a boolean
// indicating its inclusion in the options
export function getDistributionOptions(distribution, filter) {
    let options = []
    for (let dep of distribution.distributiondataelementpathSet) {
        if (filter && !filter(dep.dataElement)) {
            continue
        }
        options.push({value: dep.dataElement.uuid, text: dep.dataElement.dataElementConcept.property.name})
    }
    return options
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

// Filter for data elements to use with getDistributionOptions
export function filterNumberDataElements(data_element) {
    if (data_element.valueDomain && data_element.valueDomain.dataType) {
        return data_element.valueDomain.dataType.name === 'Number'
    }
    return false
}

// Filter for data element that have permissible values
export function filterValueDataElements(data_element) {
    if (data_element.valueDomain) {
        return data_element.valueDomain.permissiblevalueSet.length > 0
    }
    return false
}

export function getDatasetSpecification() {
    // Identifier for covid dss
    const uuid = "f8cf638e-6cc4-11ea-9034-02f12b5fb674"
    const query = `
    query ($uuid: UUID) {
      datasetSpecifications (uuid:$uuid) {
        edges {
          node {
            name
            uuid
            dssdeinclusionSet {
              dataElement {
                uuid
                name
                dedinputsthroughSet {
                  dataElementDerivation {
                    uuid
                    name
                    dedderivesthroughSet {
                      dataElement {
                        uuid
                        name
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }`

    return graphqlQuery(query, {uuid: uuid}).then((response) => {
        return response.data.data.datasetSpecifications.edges[0].node
    })
}

// Get map of data element uuid to logicalPath
export function mapDistributionData(distribution) {
    let map = new Map();
    for (let dep of distribution.distributiondataelementpathSet) {
        if (dep.dataElement) {
            map.set(dep.dataElement.uuid, dep.logicalPath)
        }
    }
    return map
}
