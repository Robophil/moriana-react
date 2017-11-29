// actions and reducer for editing a shipment
// thunks are in utils/update-shipment

import {clone, generateId} from 'utils/utils'
import { validateShipment } from 'utils/validation'
import { updateShipment } from 'utils/update-shipment'
import { REQUEST_SHIPMENT, RECEIVED_SHIPMENT, SHIPMENTS_ERROR } from 'store/shipments'

export const START_NEW_SHIPMENT = 'START_NEW_SHIPMENT'
export const UPDATE_SHIPMENT = 'UPDATE_SHIPMENT'
export const SAVING_SHIPMENT = 'SAVING_SHIPMENT'
export const SAVED_SHIPMENT = 'SAVED_SHIPMENT'
export const SAVE_ERROR = 'SAVE_ERROR'
export const PREVIOUS_TARGET_REMOVED = 'PREVIOUS_TARGET_REMOVED'

export const startNewShipmentAction = (currentLocationName, dbName, shipmentType) => {
  return { type: START_NEW_SHIPMENT, currentLocationName, dbName, shipmentType }
}

export const updateShipmentAction = (key, value, username) => {
  return { type: UPDATE_SHIPMENT, key, value, username }
}

// reducers

const defaultEditShipment = {
  loadingInitialShipment: false,
  savingShipment: false,
  apiError: null,
  shipment: {},
  dbName: null,
  isNew: true,
  isValid: false,
  deleted: false,
  shipmentType: null,
  displayType: null,
  shipmentName: null,
  previousTarget: null
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
      switch (action.key) {
        case 'date': {
          newState.shipment.date = action.value
          break
        }
        case 'from': {
          Object.assign(newState.shipment, getTargetDetails('from', action.value, state.shipmentType))
          break
        }
        case 'to': {
          if (!newState.isNew) {
            newState.previousTarget = newState.shipment.to
          }
          Object.assign(newState.shipment, getTargetDetails('to', action.value, state.shipmentType))
          break
        }
        case 'patient': {
          newState.shipment.to = action.value.name
          newState.shipment.toType = 'P'
          newState.shipment.patient = action.value
          break
        }
        case 'vendorId': {
          newState.shipment.vendorId = action.value
          break
        }
        case 'receive_transaction': {
          const { editedTransaction, deleted, index } = action.value
          const currentTransactions = newState.shipment.transactions
          let transactions
          if (deleted) {
            transactions = deleteReceiveTransaction(currentTransactions, index)
          } else {
            transactions = editReceiveTransactions(currentTransactions, editedTransaction, index, action.username)
          }
          newState.shipment.transactions = transactions
          Object.assign(newState.shipment, getTransactionTotals(transactions))
          break
        }
        case 'transfer_transactions': {
          const currentTransactions = newState.shipment.transactions
          const { editedTransactions, deleted, item, category } = action.value
          let transactions
          if (deleted) {
            transactions = deleteTransferTransactions(currentTransactions, item, category)
          } else {
            transactions = editTransferTransactions(currentTransactions, editedTransactions, item, category, action.username)
          }
          newState.shipment.transactions = transactions
          Object.assign(newState.shipment, getTransactionTotals(transactions))
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
          newState.shipment.username = action.username
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

    case PREVIOUS_TARGET_REMOVED: {
      const newState = clone(state)
      return { ...state, previousTarget: null }
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
  return details
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


const getTransactionTotals = (transactions) => {
  return transactions.reduce((memo, t) => {
    memo.totalValue += t.totalValue
    memo.totalTransactions ++
    return memo
  }, { totalValue: 0, totalTransactions: 0 })
}

// reminder: splice is (start index, # of things to remove/replace, [optional things to replace them with])
const editReceiveTransactions = (currentTransactions, newTransaction, editIndex, username) => {
  const transactions = clone(currentTransactions)
  const transaction = timestampAndSanitizeTransaction(newTransaction, username)
  if (editIndex || editIndex === 0) {
    transactions.splice(editIndex, 1, transaction)
  } else {
    transactions.unshift(transaction)
  }
  return transactions
}

const deleteReceiveTransaction = (currentTransactions, index) => {
  const transactions = clone(currentTransactions)
  transactions.splice(index, 1)
  return transactions
}

export const editTransferTransactions = (currentTransactions, editedTransactions, item, category, username) => {
  const transactions = []
  let added = false
  const timestampedEditedTransactions = editedTransactions.map(t => timestampAndSanitizeTransaction(t, username))
  clone(currentTransactions).forEach(t => {
    if (t.item === item && t.category === t.category) {
      if (!added) {
        transactions.push(...timestampedEditedTransactions)
        added = true
      }
    } else {
      transactions.push(t)
    }
  })
  if (!added) {
    transactions.unshift(...timestampedEditedTransactions)
  }
  return transactions
}

const deleteTransferTransactions = (currentTransactions, item, category) => {
  return clone(currentTransactions).filter(t => t.item !== item && t.category !== category)
}

export const timestampAndSanitizeTransaction = (inputTransaction, username) => {
  const updated = new Date().toISOString()
  let { item, category, quantity, expiration, lot, unitPrice } = clone(inputTransaction)
  let totalValue = 0
  lot = lot || null
  if (unitPrice) {
    totalValue = unitPrice * quantity
  } else {
    unitPrice = 0
  }
  return { item, category, quantity, expiration, lot, unitPrice, totalValue, username, updated }
}
