// Covid data access
/* global process */
import axios from 'axios'

const url = 'https://registry.aristotlemetadata.com/api/graphql/json'
const headers = {'Authorization': `Token ${process.env.TOKEN}`}

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
                  permissiblevalueSet {
                    value
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
// Filter is optional function that recieves a data element and return a boolean
// indicating its inclusion in the options
export function getDistributionOptions(distribution, filter) {
    let options = []
    for (let dep of distribution.distributiondataelementpathSet) {
        if (filter && !filter(dep.dataElement)) {
            continue
        }
        options.push({value: dep.dataElement.uuid, text: dep.dataElement.name}) 
    }
    return options
}
