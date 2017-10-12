// actions and reducer for editing a shipment

import client from 'client'
import {clone, generateId} from 'utils'

import { validateShipment } from 'validation'
import { getTransactionFromInput } from 'input-transforms'

// actions

import { REQUEST_SHIPMENT, RECEIVED_SHIPMENT, SHIPMENTS_ERROR } from 'shipments'

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const UPDATE_SHIPMENT = 'UPDATE_SHIPMENT'
export const SAVING_SHIPMENT = 'SAVING_SHIPMENT'
export const SAVED_SHIPMENT = 'SAVED_SHIPMENT'
export const SAVE_ERROR = 'SAVE_ERROR'

export const startNewShipmentAction = (currentLocationName, dbName, shipmentType) => {
  return { type: START_NEW_SHIPMENT, currentLocationName, dbName, shipmentType }
}

export const updateShipmentAction = (key, value, username) => {
  return { type: UPDATE_SHIPMENT, key, value, username }
}

// thunkettes

export const updateShipment = (key, value) => {
  return (dispatch, getState) => {
    dispatch(updateShipmentAction(key, value, getState().user.name))
    const state = getState().editshipment
    if (state.isValid) {
      // don't save a new shipment until there are transactions
      if (state.isNew && state.shipment.transactions.length === 0) return
      dispatch({ type: SAVING_SHIPMENT })
      client.put(`${state.dbName}/${state.shipment._id}`, state.shipment)
      .then(response => {
        if (response.status >= 400) {
          dispatch({ type: SAVE_ERROR, error: response.body })
        } else {
          dispatch({ type: SAVED_SHIPMENT, rev: response.body.rev })
        }
      })
    }
  }
}

// reducers

const defaultEditShipment = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  dbName: null,
  type: null,
  isNew: true,
  isValid: false,
  deleted: false
}

export default (state = defaultEditShipment, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENT: {
      return { ...defaultEditShipment, loadingInitialShipment: true, dbName: action.dbName }
    }

    case RECEIVED_SHIPMENT: {
      const shipment = clone(action.shipment)
      return { ...state, shipment, loadingInitialShipment: false, isNew: false, ...action.meta }
    }

    case SHIPMENTS_ERROR: {
      return {
        ...state,
        loading: false,
        apiError: action.error
      }
    }

    case START_NEW_SHIPMENT: {
      const shipment = createNewShipment(action.currentLocationName, action.shipmentType)
      return {
        ...defaultEditShipment,
        dbName: action.dbName,
        shipment,
        shipmentType: action.shipmentType
      }
    }

    case UPDATE_SHIPMENT: {
      const newState = clone(state)
      const {key, value, username} = action
      switch (action.key) {
        case 'date': {
          newState.shipment.date = value
          break
        }
        case 'from': {
          Object.assign(newState.shipment, getTargetDetails('from', value, state.shipmentType))
          break
        }
        case 'to': {
          Object.assign(newState.shipment, getTargetDetails('to', value, state.shipmentType))
          break
        }
        case 'vendorId': {
          newState.shipment.vendorId = value
          break
        }
        case 'transaction': {
          if (state.shipmentType === 'receive') {
            editReceiveTransaction(newState.shipment, value, username)
          } else {
            newState.shipment.transactions = makeTransferTransactionEdits(newState.shipment, value, username)
          }
          Object.assign(newState.shipment, getTransactionTotals(newState.shipment))
          break
        }
        case 'delete': {
          newState.shipment._deleted = true
          newState.deleted = true
        }
      }
      Object.assign(newState, validateShipment(newState.shipment))
      if (newState.isValid) {
        newState.shipment.updated = new Date().toISOString()
        if (!newState.shipment.username && newState.isNew) {
          newState.shipment.username = username
        }
      }
      return newState
    }

    case SAVING_SHIPMENT: {
      const shipment = clone(state.shipment)
      return { ...state, shipment, savingShipment: true }
    }

    case SAVED_SHIPMENT: {
      const shipment = clone(state.shipment)
      shipment._rev = action.rev
      return { ...state, isNew: false, shipment, savingShipment: false }
    }

    case SAVE_ERROR: {
      const shipment = clone(state.shipment)
      return { ...state, shipment, apiError: action.error, savingShipment: false }
    }

    default: {
      return state
    }
  }
}

const createNewShipment = (currentLocationName, shipmentType) => {
  const date = new Date().toISOString()
  const username = 'testname'
  const shipment = {
    date,
    docType: 'shipment',
    created: date,
    updated: date,
    _id: generateId(username, date, 'shipment'),
    transactions: [],
    totalValue: 0,
    totalTransactions: 0
  }
  if (shipmentType === 'receive') {
    shipment.to = currentLocationName.toLowerCase()
    shipment.toType = 'I'
  } else {
    shipment.from = currentLocationName.toLowerCase()
    shipment.fromType = 'I'
  }
  return shipment
}

const getTargetDetails = (fromOrTo, value, shipmentType) => {
  const details = {}
  details[fromOrTo] = value.name
  details[`${fromOrTo}Type`] = value.type || getTargetType(shipmentType)
  details[`${fromOrTo}Attributes`] = value.attributes
  if (shipmentType === 'dispense') {
    details.patient = getPatientForShipment(value)
  }
  return details
}

const getPatientForShipment = (patient) => {
  const { identifier, gender, dob, district } = patient
  return { identifier, gender, dob, district }
}

const getTargetType = (shipmentType) => {
  const typeMap = {
    'receive': 'E',
    'transfer': 'I',
    'transfer-out': 'E',
    'dispense': 'P'
  }
  return typeMap[shipmentType]
}


const getTransactionTotals = (shipment) => {
  return shipment.transactions.reduce((memo, t) => {
    memo.totalValue += t.totalValue
    memo.totalTransactions ++
    return memo
  }, { totalValue: 0, totalTransactions: 0 })
}

// reminder: splice is (start index, # of things to remove/replace, [optional things to replace them with])
const editReceiveTransaction = (shipment, value, username) => {
  if (value.delete) {
    shipment.transactions.splice(value.index, 1)
  } else {
    const transaction = getTransactionFromInput(value, username)
    if (value.index !== undefined) {
      shipment.transactions.splice(value.index, 1, transaction)
    } else {
      shipment.transactions.unshift(transaction)
    }
  }
}

export const makeTransferTransactionEdits = (shipment, displayTransactions, username) => {
  // const newTransactions = clone(displayTransactions).reduce((memo,t) => {
  //   if (t.quantity) {
  //     // delete t.sum
  //     // getTransactionFromInput
  //     memo.push(t)
  //   }
  // }, [])
  // let transactions = clone(shipment.transactions)
  // const placementIndex = 0
  // const countOfExistingTransactionsOnItem = 0
  // transactions.forEach(t => {
  //   if (t.item )
  // })
  return shipment.transactions
}
