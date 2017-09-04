// actions and reducer for locations
import client from 'client'
import {objectFromKeys} from 'utils'
import { REQUEST_USER, RECEIVED_USER, parseRoles } from 'user'

export const REQUEST_LOCATIONS = 'REQUEST_LOCATIONS'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'

export const getLocations = (dbName) => {
  return dispatch => {
    dispatch({ type: REQUEST_LOCATIONS })
    let locations
    let patients
    return client.getDesignDoc(dbName, 'locations', { reduce: true, group: true })
    .then(locationsResponse => {
      locations = locationsResponse.body
      return client.getDesignDoc(dbName, 'patients', { reduce: true, group: true })
    })
    .then(patientsResponse => {
      patients = patientsResponse.body
      return client.getDesignDoc(dbName, 'types', { key: '"extension"', include_docs: true, descending: false, reduce: false })
    })
    .then(extensionsResponse => {
      const extensions = extensionsResponse.body
      dispatch({
        type: RECEIVED_LOCATIONS,
        response: { ...parseLocations(locations, extensions), patients: parsePatients(patients) }
      })
    })
  }
}

const defaultLocations = {
  loading: false,
  loadingRoles: false,
  apiError: false,
  locations: [],
  locationsExcludedFromConsumption: {},
  externalLocations: [],
  patients: [],
  roles: []
}

export default (state = defaultLocations, action) => {
  switch (action.type) {
    case REQUEST_LOCATIONS: {
      return { ...state, loading: true, apiError: null }
    }
    case REQUEST_USER: {
      return { ...state, loadingRoles: true }
    }
    case RECEIVED_USER: {
      return { ...state, roles: parseRoles(action.userCtx.roles), loadingRoles: false }
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
  const locationsExcludedFromConsumption = Object.keys(locationsHash).reduce((memo, locationKey) => {
    const location = locationsHash[locationKey]
    if (location.type === 'EV' || (location.attributes && location.attributes.excludeFromConsumption)) {
      memo[location.name] = true
    }
    return memo
  }, {})
  extensionsResponse.rows.map(row => row.doc).reduce((memo, doc) => {
    if (doc.docType === 'extension' && doc.subjectType === 'location' &&
      doc.attributes && doc.attributes.excludeFromConsumption) {
      memo[doc.subject] = true
      const locationKey = Object.keys(locationsHash).find(key => (key.indexOf(doc.subject) === 0))
      if (locationKey) {
        locationsHash[locationKey].attributes = locationsHash[locationKey].attributes || {}
        locationsHash[locationKey].attributes.excludeFromConsumption = true
      }
    }
    return memo
  }, locationsExcludedFromConsumption)
  const locations = Object.keys(locationsHash).map(key => locationsHash[key])
  const externalLocations = locations.reduce((memo, location) => {
    if (location.type === 'E' || location.type === 'EV') {
      memo.push(location)
    }
    return memo
  }, [])
  return { locations, locationsExcludedFromConsumption, externalLocations }
}

export const searchLocations = (rows, input) => {
  return rows.filter(row => (row.name.toLowerCase().indexOf(input) !== -1))
}

export const parsePatients = (patientsResponse) => {
  return patientsResponse.rows.map(row => {
    const attributes = row.key[1] || {}
    return {
      name: row.key[0],
      ...attributes
    }
  })
}
