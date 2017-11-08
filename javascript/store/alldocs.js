// actions and reducer for all docs
import Moment from 'moment'
import client from 'client'
import { getCategories } from 'items'
import clone from 'clone'

// actions

export const REQUEST_ALL_DOCS = 'REQUEST_ALL_DOCS'
export const RECEIVED_ALL_DOCS = 'RECEIVED_ALL_DOCS'
// export const ALL_DOCS_ERROR = 'ALL_DOCS_ERROR'

export const receivedAllAction = (shipments, currentLocationName) => {
  return { type: RECEIVED_ALL_DOCS, shipments, currentLocationName }
}

// thunkettes

export const getAllDocs = (dbName, currentLocationName) => {
  return dispatch => {
    dispatch({ type: REQUEST_ALL_DOCS })
    return fetchAllShipments(dbName).then(shipments => {
      dispatch(receivedAllAction(shipments, currentLocationName))
    })
  }
}

export const fetchAllShipments = (dbName) => {
  const promise = new Promise((resolve, reject) => {
    fetchShipmentsRecursively(dbName, resolve, reject)
  })
  return promise
}

const fetchShipmentsRecursively = (dbName, resolve, reject, limit = 1000, skip = 0, shipments = []) => {
  client.getDesignDoc(dbName, 'shipments', { skip, limit, include_docs: true }).then(response => {
    shipments = shipments.concat(response.body.rows.map(ship => ship.doc))
    if (response.body.rows.length !== limit) {
      resolve(shipments)
    } else {
      skip += limit
      fetchShipmentsRecursively(dbName, resolve, reject, limit, skip, shipments)
    }
  })
}

// reducers

export const defaultAllDocs = {
  loading: false,
  allDocsFetched: false,
  apiError: null,
  allItemsMap: [],
  categories: []
}

export default (state = defaultAllDocs, action) => {
  switch (action.type) {
    case REQUEST_ALL_DOCS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_ALL_DOCS: {
      const {shipments, currentLocationName}  = action
      const transactions = getTransactionsFromShipments(shipments, currentLocationName)
      const allItemsMap = buildItemsMap(transactions)
      const categories = getCategories(transactions)
      categories.unshift({ name: 'All Categories' })
      return {
        loading: false,
        allDocsFetched: true,
        categories,
        allItemsMap
      }
    }
    default: {
      return state
    }
  }
}

const getTransactionsFromShipments = (shipments, currentLocationName) => {
  currentLocationName = currentLocationName.toLowerCase()
  const transactions = []
  shipments.forEach(ship => {
    ship.transactions.map(transaction => {
      const { from, fromType, to, toType, date } = ship
      const t = { from, fromType, to, toType, date }
      Object.assign(t, transaction)
      if (t.from === currentLocationName) t.quantity = (-1 * t.quantity)
      t.expiration = !t.expiration ? null : t.expiration
      t.lot = !t.lot ? null : t.lot
      transactions.push(t)
    })
  })
  return transactions
}

const buildItemsMap = (transactions) => {
  return transactions.reduce((memo, t) => {
    const itemKey = `${t.item}__${t.category}`
    const batchKey = `${t.expiration || null}__${t.lot || null}`
    memo[itemKey] = memo[itemKey] || {}
    memo[itemKey][batchKey] = memo[itemKey][batchKey] || []
    memo[itemKey][batchKey].push(t)
    return memo
  }, {})
}
