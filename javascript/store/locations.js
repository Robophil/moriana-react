// actions and reducer for locations
import client from 'client'

export const REQUEST_LOCATIONS = 'REQUEST_ULOCATION'
export const RECEIVED_LOCATIONS = 'RECEIVED_LOCATIONS'

export const getLocations = () => {
  return dispatch => {
    return client.get('locations')
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

const defaultLocations = {
  loading: false,
  apiError: false,
  locations: [],
  extensions: []
}

export default (state = defaultLocations, action) => {
  switch (action.type) {
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
