// actions and reducer for viewing shipments
import client from 'client'
import {objectFromKeys} from 'utils'
import h from 'helpers'
import db from 'db'

export const REQUEST_SHIPMENT = 'REQUEST_SHIPMENT'
export const RECEIVED_SHIPMENT = 'RECEIVED_SHIPMENT'

export const REQUEST_SHIPMENTS = 'REQUEST_SHIPMENTS'
export const RECEIVED_SHIPMENTS = 'RECEIVED_SHIPMENTS'

export const SHIPMENTS_ERROR = 'SHIPMENTS_ERROR'

export const getShipment = (dbName, id) => {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_SHIPMENT, dbName })
    return client.getDoc(dbName, id).then(response => {
      if (response.status >= 400) {
        dispatch({ type: SHIPMENTS_ERROR, error: response.body })
      } else {
        dispatch({
          type: RECEIVED_SHIPMENT,
          shipment: response.body,
          meta: decorate(response.body, dbName)
        })
      }
    })
  }
}

export const getShipments = (dbName, offset, limit) => {
  return dispatch => {
    dispatch({ type: REQUEST_SHIPMENTS, offset })
    return client.getDesignDoc(dbName, 'shipments', { skip: offset || 0, limit }).then(response => {
      const { body } = response
      if (response.status >= 400) {
        dispatch({ type: SHIPMENTS_ERROR, error: body })
      } else {
        dispatch({
          type: RECEIVED_SHIPMENTS,
          response: {
            shipments: parseShipments(body),
            shipmentsCount: body.total_rows,
            offset: body.offset
          }
        })
      }
    })
  }
}

const defaultShipments = {
  loading: false,
  shipments: [],
  apiError: null,
  currentShipment: null,
  shipmentsCount: 0,
  offsetLoaded: null,
  shipmentType: null,
  displayType: null,
  shipmentName: null
}

export default (state = defaultShipments, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENT: {
      return { ...state, loading: true, apiError: null, currentShipment: null }
    }
    case RECEIVED_SHIPMENT: {
      return { ...state, loading: false, currentShipment: action.shipment, ...action.meta }
    }
    case REQUEST_SHIPMENTS: {
      const loading = (action.offset !== state.offsetLoaded)
      return { ...state, loading, apiError: null }
    }
    case RECEIVED_SHIPMENTS: {
      const offsetLoaded = action.response.offset
      return { ...state, offsetLoaded, loading: false, ...action.response }
    }
    case SHIPMENTS_ERROR: {
      return {
        ...state,
        loading: false,
        apiError: action.error
      }
    }
    default: {
      return state
    }
  }
}

const parseShipments = (response) => {
  return objectFromKeys(['date', 'from', 'to', 'updated', 'totalTransactions', 'username'], response)
}

// TODO: refactor out grabbing currentLocationName all over the place
const decorate = (ship, dbName) => {
  const currentLocationName = db.getNamefromDBName(dbName)
  const shipmentType = getType(ship, currentLocationName)
  const allowEdit = !(shipmentType === 'transfer' && ship.to &&
    ship.to.toLowerCase() === currentLocationName)
  const displayType = shipmentType.split('-').join(' ')
  const shipmentName = `${ship.from} to ${ship.to} on ${h.formatDate(ship.date)}`
  return { shipmentType, displayType, shipmentName, allowEdit }
}

const getType = (ship, currentLocationName) => {
  if (ship.from === currentLocationName) {
    if (ship.toType === 'I') return 'transfer'
    if (ship.toType === 'P') return 'dispense'
    return 'transfer-out'
  } else if (ship.fromType === 'I') {
    return 'transfer'
  } else {
    return 'receive'
  }
}
