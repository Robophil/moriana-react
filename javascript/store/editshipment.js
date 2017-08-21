// actions and reducer for editing a shipment

import client from 'client'
import {clone} from 'utils'

import { validateShipment } from 'validation'
import { getTransactionFromInput } from 'input-transforms'

// actions

import { REQUEST_SHIPMENT, RECEIVED_SHIPMENT } from 'shipments'

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const UPDATE_SHIPMENT = 'UPDATE_SHIPMENT'

export const UPDATE_ERROR = 'UPDATE_ERROR'

export const startNewShipmentAction = (currentLocationName, shipmentType) => {
  return { type: START_NEW_SHIPMENT, currentLocationName, shipmentType }
}

export const updateShipmentAction = (key, value) => {
  return { type: UPDATE_SHIPMENT, key, value }
}

// thunkettes

export const updateShipment = (key, value) => {
  return (dispatch, getState) => {
    dispatch(updateShipmentAction(key, value))
    const state = getState().editshipment
    if (state.isValid) {
      // UPDATING_ACTION
      client.post(`${state.dbName}/${state.shipment.id}`, state.shipment)
      // UPDATED_ACTION :) :)
    }
  }
}

// reducers

const defaultEditShipment = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  type: null,
  isNew: true,
  isValid: false
}

export default (state = defaultEditShipment, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENT: {
      return { ...defaultEditShipment, loadingInitialShipment: true }
    }

    case RECEIVED_SHIPMENT: {
      const shipment = clone(action.shipment)
      return { ...state, shipment, loadingInitialShipment: false, isNew: false }
    }

    case START_NEW_SHIPMENT: {
      const shipment = createNewShipment(action.currentLocationName)
      return { ...defaultEditShipment, shipment, type: action.shipmentType }
    }

    case UPDATE_SHIPMENT: {
      const newState = clone(state)
      const {key, value} = action
      switch (action.key) {
        case 'date': {
          newState.shipment.date = value
          break
        }
        case 'from': {
          Object.assign(newState.shipment, getTargetDetails('from', value, state.type))
          break
        }
        case 'to': {
          Object.assign(newState.shipment, getTargetDetails('to', value, state.type))
          break
        }
        case 'vendorId': {
          newState.shipment.vendorId = value
          break
        }
        case 'transaction': {
          if (state.type === 'receive') {
            editReceiveTransaction(newState.shipment, value)
          }
          Object.assign(newState.shipment, getTransactionTotals(newState.shipment))
          break
        }
      }
      Object.assign(newState, validateShipment(newState.shipment))
      return newState
    }

    default: {
      return state
    }
  }
}

const createNewShipment = (currentLocationName) => {
  const date = new Date().toISOString()
  return {
    date,
    created: date,
    updated: date,
    // username: currentUsername,
    to: currentLocationName,
    toType: 'I',
    transactions: [],
    totalValue: 0,
    totalTransactions: 0
  }
}

const getTargetDetails = (fromOrTo, value, type) => {
  const details = {}
  details[fromOrTo] = value.name
  details[`${fromOrTo}Type`] = value.type || getTargetType(type)
  details[`${fromOrTo}Attributes`] = value.attributes
  return details
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


const getTransactionTotals = (shipment) => {
  return shipment.transactions.reduce((memo, t) => {
    memo.totalValue += t.totalValue
    memo.totalTransactions ++
    return memo
  }, { totalValue: 0, totalTransactions: 0 })
}

// reminder: splice is (start index, # of things to remove/replace, [optional things to replace them with])
const editReceiveTransaction = (shipment, value) => {
  if (value.delete) {
    shipment.transactions.splice(value.index, 1)
  } else {
    const transaction = getTransactionFromInput(value)
    if (value.index !== undefined) {
      shipment.transactions.splice(value.index, 1, transaction)
    } else {
      shipment.transactions.unshift(transaction)
    }
  }

}
