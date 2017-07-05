// actions and reducer for locations
import client from 'client'
import h from 'helpers'
import config from 'config'
import db from 'db'

export const REQUEST_LOCATIONS = 'REQUEST_ULOCATION'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'
export const CHECK_FOR_LOCATION_CHANGE = 'CHECK_FOR_LOCATION_CHANGE'
export const CHANGE_LOCATION = 'CHANGE_LOCATION'

export const getLocations = () => {
  return dispatch => {
    return client.get('_session')
      .then(response => {
        const {userCtx} = response.body
        if (userCtx.name) {
          dispatch({ type: RECEIVED_LOCATIONS, userCtx })
        } else {
          dispatch({ type: FAILED_USER })
        }
      })
  }
}

export const checkLocationChange = (path) => {
  return (dispatch, getState) => {
    const currentDbName =  getState().locations.dbName
    const { name, dbName } = getCurrentLocation(path)
    if (dbName !== currentDbName) {
      dispatch({ type: CHANGE_LOCATION, name, dbName })
    }
  }
}

const currentLocation = getCurrentLocation()

const defaultLocations = {
  loading: false,
  apiError: false,
  locations: [],
  extensions: [],
  currentLocation: currentLocation.name,
  dbName: currentLocation.dbName
}

export default (state = defaultLocations, action) => {
  switch (action.type) {
    case CHANGE_LOCATION: {
      return { ...state, currentLocation: action.name, dbName: action.dbName }
    }
    case REQUEST_LOCATIONS: {
      return { ...defaultLocations, loading: true }
    }
    case RECEIVED_LOCATIONS: {
      return { ...state }
    }
    default: {
      return state
    }
  }
}

function getCurrentLocation(pathname = window.location.hash) {
  let name, dbName = null
  const urlSplit = pathname.split('/d/')
  if (urlSplit.length > 1 ) {
    dbName = urlSplit[1].split('/')[0]
    name = db.getNamefromDBName(dbName, config.deploymentName)
  }
  return { name, dbName }
}
