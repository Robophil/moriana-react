// actions and reducer for locations
import client from 'client'

export const REQUEST_LOCATIONS = 'REQUEST_ULOCATION'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'

export const getLocations = (dbName) => {
  return dispatch => {
    dispatch({ type: REQUEST_LOCATIONS })
    return client.getDesignDoc(dbName, 'locations', { reduce: true, group: true })
    .then(locationsResponse => {
        const locations = locationsResponse.body
        return client.getDesignDoc(dbName, 'types', { key: '"extension"', include_docs: true, descending: false, reduce: false })
        .then(extensionsResponse => {
          const extensions = extensionsResponse.body
          dispatch({
            type: RECEIVED_LOCATIONS,
            response: { ...parseLocations(locations, extensions) }
          })
        })
    })
  }
}

const defaultLocations = {
  loading: false,
  apiError: false,
  locations: [],
  excludedFromConsumptionLocations: {}
}

export default (state = defaultLocations, action) => {
  switch (action.type) {
    case REQUEST_LOCATIONS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_LOCATIONS: {
      return { ...state, loading: false, ...action.response }
    }
    default: {
      return state
    }
  }
}

function parseLocations (locations, extensions) {
  console.log(locations, extensions)
  return {}
  // const headers = ['type', 'name', 'attributes']
  // const rows = body.rows.map(row => {
  //   headers.map((header, i) => row[header] = row.key[i])
  //   return row
  // }).sort((a, b) => a.item.toLowerCase().localeCompare(b.item.toLowerCase()))
  // return { rows }
}
