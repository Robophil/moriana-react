// actions and reducer for locations
import client from 'client'
import {objectFromKeys} from 'utils'

export const REQUEST_LOCATIONS = 'REQUEST_ULOCATION'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'

export const getLocations = (dbName) => {
  return dispatch => {
    dispatch({ type: REQUEST_LOCATIONS })
    let locations
    return client.getDesignDoc(dbName, 'locations', { reduce: true, group: true })
    .then(locationsResponse => {
      locations = locationsResponse.body
      return client.getDesignDoc(dbName, 'types', { key: '"extension"', include_docs: true, descending: false, reduce: false })
    })
    .then(extensionsResponse => {
      const extensions = extensionsResponse.body
      dispatch({
        type: RECEIVED_LOCATIONS,
        response: { ...parseLocations(locations, extensions) }
      })
    })
  }
}

const defaultLocations = {
  loading: false,
  apiError: false,
  locations: [],
  locationsExcludedFromConsumption: {},
  externalLocations: [],
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

export const parseLocations = (locationsResponse, extensionsResponse) => {
  // let's get unique locations
  const locationsHash = objectFromKeys(['type', 'name', 'attributes'], locationsResponse)
    .reduce((memo, location) => {
      memo[`${location.name}__${location.type}`] = location
      return memo
    }, {})
  const locations = Object.keys(locationsHash).map(key => locationsHash[key])
  const locationsExcludedFromConsumption = locations.reduce((memo, location) => {
    if (location.type === 'EV' || location.attributes && location.attributes.excludeFromConsumption) {
      memo[location.name] = true
    }
    return memo
  }, {})
  extensionsResponse.rows.map(row => row.doc).reduce((memo, doc) => {
    if (doc.docType === 'extension' && doc.subjectType === 'location'
      && doc.attributes && doc.attributes.excludeFromConsumption) {
      memo[doc.subject] = true
    }
    return memo
  }, locationsExcludedFromConsumption)
  const externalLocations = locations.reduce((memo, location) => {
    if (location.type === 'E' || location.type === 'EV') {
      memo.push(location)
    }
    return memo
  }, [])
  return { locations, locationsExcludedFromConsumption, externalLocations }
}
