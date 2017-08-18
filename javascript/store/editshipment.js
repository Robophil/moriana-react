// actions and reducer for editing a shipment

// import client from 'client'
import {clone} from 'utils'

import { dateIsValid, transactionIsValid } from 'validation'
import { getISODateFromInput, getTransactionFromInput } from 'input-transforms'

// actions

import { REQUEST_SHIPMENT, RECEIVED_SHIPMENT } from 'shipments'

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const UPDATE_DATE = 'UPDATE_DATE'
export const UPDATE_FROM = 'UPDATE_FROM'
export const UPDATE_TO = 'UPDATE_TO'
export const UPDATE_LOCATION = 'UPDATE_LOCATION'
export const UPDATE_VENDORID = 'UPDATE_VENDORID'
export const UPDATE_RECEIVE_TRANSACTIONS = 'UPDATE_RECEIVE_TRANSACTIONS'
export const DELETE_RECEIVE_TRANSACTION = 'DELETE_RECEIVE_TRANSACTION'

export const UPDATE_ERROR = 'UPDATE_ERROR'

export const startNewShipmentAction = (currentLocationName, shipmentType) => {
  return { type: START_NEW_SHIPMENT, currentLocationName, shipmentType }
}

export const updateShipmentAction = (key, inputValue) => {
  const type = key.toUpperCase()
  return { type: `UPDATE_${type}`, key, inputValue }
}

export const deleteTransactionAction = (index) => {
  return { type: DELETE_RECEIVE_TRANSACTION, index }
}

// thunkettes

export const updateShipment = (key, inputValue) => {
  return dispatch => {
    dispatch(updateShipmentAction(key, inputValue))
  }
}

export const deleteTransaction = (index) => {
  return dispatch => {
    dispatch(deleteTransactionAction(index))
  }
}

// reducers

const defaultEditShipment = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  dateError: false,
  transactionIsInvalid: false,
  type: null
}

export default (state = defaultEditShipment, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENT: {
      return { ...state, loadingInitialShipment: true }
    }
    case RECEIVED_SHIPMENT: {
      const shipment = clone(action.shipment)
      return { ...state, shipment, loadingInitialShipment: false }
    }
    case START_NEW_SHIPMENT: {
      const shipment = createNewShipment(action.currentLocationName)
      return { ...state, shipment, type: action.shipmentType }
    }

    case UPDATE_DATE: {
      const newState = { ...state, shipment: clone(state.shipment) }
      const error = dateIsValid(action.inputValue)
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
    /* eslint-disable */
    case UPDATE_FROM: { /* continue to UPDATE_LOCATION */ }
    case UPDATE_TO: { /* continue to UPDATE_LOCATION */ }
    case UPDATE_LOCATION: {
      /* eslint-enable */
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

    case UPDATE_RECEIVE_TRANSACTIONS: {
      const newState = { ...state, shipment: clone(state.shipment) }
      const transactionInput = action.inputValue
      const isValid = transactionIsValid(transactionInput)
      if (isValid) {
        const transaction = getTransactionFromInput(transactionInput)
        if (transactionInput.editIndex !== undefined) {
          // splice is (indexToStartFingWith, numberOfListItems, [optionalReplacewithThing])
          newState.shipment.transactions.splice(transactionInput.editIndex, 1, transaction)
        } else {
          newState.shipment.transactions.unshift(transaction)
        }
        newState.transactionIsInvalid = false
      } else {
        newState.transactionIsInvalid = true
      }
      Object.assign(newState.shipment, getTransactionTotals(newState.shipment))
      return newState
    }

    case DELETE_RECEIVE_TRANSACTION: {
      const shipment = clone(state.shipment)
      const newState = { ...state, shipment }
      // at this index, remove one thing
      newState.shipment.transactions.splice(action.index, 1)
      Object.assign(newState.shipment, getTransactionTotals(newState.shipment))
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
