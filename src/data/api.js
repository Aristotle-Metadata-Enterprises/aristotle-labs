// General api access functions
import axios from 'axios'

// Perform a graphql query on the aristotle registry
export function graphqlQuery(query, variables) {
    // Url for our registries graphql endpoint
    const graphql_url = 'https://registry.aristotlemetadata.com/api/graphql/json'
    const query_obj = {query: query, variables: variables}
    return axios.post(graphql_url, query_obj)
}

// Query a distribution and its components
export function queryDistribution(uuid) {
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

// Query a dataset specification and its components
export function queryDss(uuid) {
    const query = `
    query ($uuid: UUID) {
      datasetSpecifications (uuid:$uuid) {
        edges {
          node {
            name
            uuid
            aristotleId
            dssdeinclusionSet {
              dataElement {
                uuid
                aristotleId
                name
                dedinputsthroughSet {
                  dataElementDerivation {
                    uuid
                    aristotleId
                    name
                    dedderivesthroughSet {
                      dataElement {
                        uuid
                        aristotleId
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
