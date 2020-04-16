// Covid data access functions to be used across vue components
/* global process */
import axios from 'axios'

const url = 'https://registry.aristotlemetadata.com/api/graphql/json'
const headers = {'Authorization': `Token ${process.env.TOKEN}`}

const data_url = 'https://aristotle-ecdc-covid19-data.s3-ap-southeast-2.amazonaws.com/daily_data.json';

export function getCovidData() {
    // Get the COVID-19 data and return as javascript object
    return axios.get(data_url).then((response) => {
       return response.data;

    }).catch((error => {
        // TODO: handle errors gracefully
        console.log(error)
        })
    )
}

// Query covid distribution data 
export function getDistribution() {
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

    const query_obj = {
        query: query,
        variables: {
            uuid: "11c5d3ac-73d0-11ea-9c38-02d94c4bd698"
        }
    }

    return axios.post(url, query_obj, {headers: headers}).then((response) => {
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
