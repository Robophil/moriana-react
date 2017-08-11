// actions and reducer for edit receive
import client from 'client'
import {clone} from 'utils'

import {validateDateInput} from 'validation'
import {getISODateFromInput} from 'input-transforms'

// actions

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const REQUEST_UPDATE = 'REQUEST_UPDATE'
export const UPDATE_ERROR = 'UPDATE_ERROR'

export const startNewShipment = (currentLocationName, currentUsername) => {
  const shipment = createNewShipment(currentLocationName, currentUsername)
  return { type: START_NEW_SHIPMENT, shipment }
}

export const updateShipment = (key, inputValue) => {
  switch (key) {
    case 'date': {
      const error = validateDateInput(inputValue)
      if (error) {
        return { type: UPDATE_ERROR, errorType: 'dateError', 'errorValue': true }
      } else {
        const value = getISODateFromInput(inputValue)
        return { type: REQUEST_UPDATE, key, value, errorType: 'dateError', 'errorValue': false }
      }
      break
    }
    case 'vendorId': {
      return { type: REQUEST_UPDATE, key, value: inputValue }
      break
    }
  }
}

// thunkettes

// reducers

const defaultEditReceive = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  dateError: false,
}

export default (state = defaultEditReceive, action) => {
  switch (action.type) {
    case START_NEW_SHIPMENT: {
      return { ...state, shipment: action.shipment }
    }
    case REQUEST_UPDATE: {
      const newState = { ...state, shipment: clone(state.shipment) }
      newState.shipment[action.key] = action.value
      if (action.errorType) {
        newState[action.errorType] = action.errorValue
      }
      return newState
    }
    case UPDATE_ERROR: {
      const newState = { ...state, shipment: clone(state.shipment) }
      newState[action.errorType] = action.errorValue
      return newState
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
