// actions and reducer for admin
import client from 'client'
import decorateShipment from 'decorate-shipment';

export const REQUEST_SHIPMENT = 'REQUEST_SHIPMENT'
export const RECEIVED_SHIPMENT = 'RECEIVED_SHIPMENT'

export const REQUEST_SHIPMENTS = 'REQUEST_SHIPMENTS'
export const RECEIVED_SHIPMENTS = 'RECEIVED_SHIPMENTS'

export const SHIPMENTS_ERROR = 'SHIPMENTS_ERROR'

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

export const getShipments = (dbName, offset, limit) => {
  return dispatch => {
    dispatch({ type: REQUEST_SHIPMENTS })
    return client.getDesignDoc(dbName, 'shipments', { skip: offset || 0, limit }).then(response => {
      const { body } = response
      if (response.status >= 400) {
        dispatch({ type: SHIPMENTS_ERROR, error: body })
      } else {
        dispatch({
          type: RECEIVED_SHIPMENTS,
          response: {
            shipments: parseShipments(body.rows),
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
}

export default (state = defaultShipments, action) => {
  switch (action.type) {
    case REQUEST_SHIPMENT: {
      return { ...state, loading: true, apiError: null, currentShipment: null }
    }
    case RECEIVED_SHIPMENT: {
      return { ...state, loading: false, currentShipment: action.shipment }
    }
    case REQUEST_SHIPMENTS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_SHIPMENTS: {
      return { ...state, loading: false, ...action.response }
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

const parseShipments = (rows) => {
  const headers = ['date', 'from', 'to', 'updated', 'totalTransactions', 'username']
  return rows.map(row => {
    headers.map((header, i) => row[header] = row.key[i])
    delete row.key
    return row
  })
}
