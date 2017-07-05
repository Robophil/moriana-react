// actions and reducer for admin
import client from 'client'
import decorateShipment from 'decorate-shipment';

export const REQUEST_SHIPMENTS = 'REQUEST_SHIPMENTS'
export const RECEIVED_SHIPMENTS = 'RECEIVED_SHIPMENTS'
export const REQUEST_SHIPMENT = 'REQUEST_SHIPMENT'
export const RECEIVED_SHIPMENT = 'RECEIVED_SHIPMENT'
export const SHIPMENTS_ERROR = 'SHIPMENTS_ERROR'

export const getShipments = (dbName) => {
  return dispatch => {
    dispatch({ type: REQUEST_SHIPMENTS })
    return client.getDesignDoc(dbName, 'shipments').then(response => {
        const { body } = response
        if (response.status >= 400) {
          dispatch({ type: SHIPMENTS_ERROR, error: body })
        } else {
          dispatch({
            type: RECEIVED_SHIPMENTS,
            response: {
              rows: parseShipments(body.rows),
              shipmentsCount: body.total_rows,
              offset: body.offset
            }
          })
        }
      })
  }
}

export const getShipment = (dbName, id) => {
  return (dispatch, getState) => {
    dispatch({ type: REQUEST_SHIPMENT })
    return client.getDoc(dbName, id).then(response => {
        if (response.status >= 400) {
          dispatch({ type: SHIPMENTS_ERROR, error: response.body })
        } else {
          const {currentLocation} = getState().locations
          const prettyShip = decorateShipment.decorate(response.body, currentLocation)
          dispatch({ type: RECEIVED_SHIPMENT, shipment: prettyShip })
        }
      })
  }
}

const defaultShipments = {
  loading: false,
  rows: [],
  apiError: null,
  currentShipment: null
}

export default (state = defaultShipments, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENTS: {
      return { ...state, loading: true }
    }
    case RECEIVED_SHIPMENTS: {
      return { ...state, loading: false, ...action.response }
    }
    case REQUEST_SHIPMENT: {
      return { ...state, loading: true }
    }
    case RECEIVED_SHIPMENT: {
      return { ...state, loading: false, currentShipment: action.shipment }
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

function parseShipments (rows) {
  const headers = ['date', 'from', 'to', 'updated', 'totalTransactions', 'username']
  return rows.map(row => {
    headers.map((header, i) => row[header] = row.key[i])
    delete row.key
    return row
  })
}
