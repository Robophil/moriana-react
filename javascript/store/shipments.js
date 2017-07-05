// actions and reducer for admin
import client from 'client'
import CHANGE_LOCATION from 'locations'

export const REQUEST_SHIPMENTS = 'REQUEST_SHIPMENTS'
export const RECEIVED_SHIPMENTS = 'RECEIVED_SHIPMENTS'

export const getShipments = () => {
  return dispatch => {
    dispatch({ type: REQUEST_SHIPMENTS })
    return client.get('shipments')
      .then(ships => console.log(ships) )
  }
}

const defaultShipments = {
  loading: false,
  shipments: []
}

export default (state = defaultShipments, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENTS: {
      return { ...state, loading: true }
    }
    case RECEIVED_SHIPMENTS: {
      return {
        ...state,
        loading: false,
        shipments: action.response || []
      }
    }
    default: {
      return state
    }
  }
}
