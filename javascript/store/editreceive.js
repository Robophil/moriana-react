// actions and reducer for edit receive
import client from 'client'
import {clone} from 'utils'

import {validateDateInput} from 'validation'
import {getISODateFromInput} from 'input-transforms'

// actions

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const UPDATE_DATE = 'UPDATE_DATE'
export const UPDATE_FROM = 'UPDATE_FROM'
export const UPDATE_TO = 'UPDATE_TO'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const UPDATE_VENDORID = 'UPDATE_VENDORID'
export const UPDATE_TRANSACTIONS = 'UPDATE_TRANSACTIONS'

export const UPDATE_ERROR = 'UPDATE_ERROR'

export const startNewShipment = (currentLocationName, currentUsername, shipmentType) => {
  return { type: START_NEW_SHIPMENT, currentLocationName, currentUsername, shipmentType }
}

// thunkettes

export const updateShipment = (key, inputValue) => {
  return dispatch => {
    const type = key.toUpperCase()
    dispatch({ type: `UPDATE_${type}`, key, inputValue })
  }
}

// reducers

const defaultEditReceive = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  dateError: false,
  type: null,
}

export default (state = defaultEditReceive, action) => {
  switch (action.type) {
    case START_NEW_SHIPMENT: {
      const shipment = createNewShipment(action.currentLocationName, action.currentUsername)
      return { ...state, shipment, type: action.shipmentType }
    }

    case UPDATE_DATE: {
      const newState = { ...state, shipment: clone(state.shipment) }
      const error = validateDateInput(action.inputValue)
      if (error) {
        newState.dateError = true
        return newState
      } else {
        newState.shipment.date = getISODateFromInput(action.inputValue)
        newState.dateError = false
      }
      return newState
    }

    case UPDATE_VENDORID: {
      const shipment = clone(state.shipment)
      shipment.vendorId = action.inputValue
      return { ...state, shipment }
    }

    case UPDATE_FROM: { /* continue to UPDATE_LOCATION */ }
    case UPDATE_TO: { /* continue to UPDATE_LOCATION */ }
    case UPDATE_LOCATION: {
      const shipment = clone(state.shipment)
      shipment[action.key] = action.inputValue.name
      if (action.inputValue.type) {
        shipment[`${action.key}Type`] = action.inputValue.type
      } else {
        shipment[`${action.key}Type`] = getTargetType(state.type)
      }
      shipment[`${action.key}Attributes`] = action.inputValue.attributes
      return { ...state, shipment }
    }

    default: {
      return state
    }
  }
}

const createNewShipment = (currentLocationName, currentUsername) => {
  const date = new Date().toISOString()
  return {
    date,
    created: date,
    updated: date,
    username: currentUsername,
    to: currentLocationName,
    toType: 'I',
  }
}

const getTargetType = (type) => {
  const typeMap = {
    'receive': 'E',
    'transfer': 'I',
    'transfer-out': 'E',
    'dispense': 'P'
  }
  return typeMap[type]
}
