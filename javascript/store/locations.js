/* actions and reducer for locations
- requests locations design doc & extensions docs
- also, on user received action, adds user roles for internal locations
- doesn't request user as that's always done on app init
*/
import client from 'utils/client'
import {objectFromKeys} from 'utils/utils'
import { RECEIVED_USER, parseRoles } from 'store/user'

export const REQUEST_LOCATIONS = 'REQUEST_LOCATIONS'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'

export const getLocations = (dbName) => {
  return dispatch => {
    dispatch({ type: REQUEST_LOCATIONS })
    let locations
    let patientsResponse
    return client.getDesignDoc(dbName, 'locations', { reduce: true, group: true })
    .then(locationsResponse => {
      locations = locationsResponse.body
      return client.getDesignDoc(dbName, 'patients', { reduce: true, group: true })
    })
    .then(response => {
      patientsResponse = response.body
      return client.getDesignDoc(dbName, 'types', {
        key: '"extension"',
        include_docs: true,
        descending: false,
        reduce: false
      })
    })
    .then(extensionsResponse => {
      const extensions = extensionsResponse.body
      const {patients, districts} = parsePatients(patientsResponse)
      dispatch({
        type: RECEIVED_LOCATIONS,
        response: { ...parseLocations(locations, extensions), patients, districts }
      })
    })
  }
}

const defaultLocations = {
  loading: false,
  initialRequestComplete: false,
  apiError: false,
  locations: [],
  locationsExcludedFromConsumption: {},
  externalLocations: [],
  patients: [],
  districts: [],
  roles: [],
}

export default (state = defaultLocations, action) => {
  switch (action.type) {
    case REQUEST_LOCATIONS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_USER: {
      return { ...state, roles: parseRoles(action.userCtx.roles) }
    }
    case RECEIVED_LOCATIONS: {
      return { ...state, loading: false, initialRequestComplete: true, ...action.response }
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
  const districts = new Set()
  const patients = patientsResponse.rows.map(row => {
    const attributes = row.key[1] || {}
    if (attributes.district) districts.add(attributes.district)
    return {
      name: row.key[0],
      ...attributes
    }
  })
  return { patients, districts: [...districts].map(d => { return { name: d } })}
}
