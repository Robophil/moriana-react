// actions and reducer for edit receive
import client from 'client'
import {clone} from 'utils'

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const REQUEST_UPDATE = 'REQUEST_UPDATE'

export const startNewShipment = (currentLocationName, currentUsername) => {
  const shipment = createNewShipment(currentLocationName, currentUsername)
  return { type: START_NEW_SHIPMENT, shipment }
}

export const updateShipment = (key, value) => {
  return { type: REQUEST_UPDATE, key, value }
}

const defaultEditReceive = {
  loadingInitialShipment: false,
  shipment: {},
  apiError: null,
  savingShipment: false,
}

export default (state = defaultEditReceive, action) => {
  switch (action.type) {
    case START_NEW_SHIPMENT: {
      return { ...state, shipment: action.shipment }
    }
    case REQUEST_UPDATE: {
      const shipment = clone(state.shipment)
      shipment[action.key] = action.value
      return { ...state, shipment }
    }
    default: {
      return state
    }
  }
}

const createNewShipment = (currentLocationName, currentUsername) => {
  return {
    date: new Date().toISOString(),

  }
}
