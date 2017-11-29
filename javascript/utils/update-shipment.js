/*  Thunk for updating a shipment

* Receive, Transfer, Transfer-Out, Dispense
1) Create 2) Update, 3) delete shipment at current database

* Transfer
1) Create, 2) Update, 3) Delete shipment also at target database
4) If transfer location changed, delete shipment at previous transfer location
*/

import {
  START_NEW_SHIPMENT,
  UPDATE_SHIPMENT,
  SAVING_SHIPMENT,
  SAVED_SHIPMENT,
  SAVE_ERROR,
  PREVIOUS_TARGET_REMOVED,
  updateShipmentAction
} from 'store/editshipment'

import client from 'utils/client'
import db from 'utils/db'
import {showNote} from 'store/notifications'
import {clone} from 'utils/utils'

export const updateShipment = (key, value) => {
  return (dispatch, getState) => {
    dispatch(updateShipmentAction(key, value, getState().user.name))
    const state = getState().editshipment
    if (state.isValid) {
      // don't save a new shipment until there are transactions
      if (state.isNew && state.shipment.transactions.length === 0) return
      dispatch({ type: SAVING_SHIPMENT })
      savingNotification(dispatch, db.getNamefromDBName(state.dbName), state.shipment._deleted)
      client.put(`${state.dbName}/${state.shipment._id}`, state.shipment).then(response => {
        if (response.status >= 400) {
          dispatch({ type: SAVE_ERROR, error: response.body })
        } else {
          dispatch({ type: SAVED_SHIPMENT, rev: response.body.rev })
          saveNotification(dispatch, db.getNamefromDBName(state.dbName), state.shipment._deleted)
          if (state.shipmentType === 'transfer') {
            saveAtTransferLocation(dispatch, state.shipment, state.shipment.to)
            if (state.previousTarget) {
              const deletedShipment = clone(state.shipment)
              deletedShipment._deleted = true
              saveAtTransferLocation(dispatch, deletedShipment, state.previousTarget).then(() => {
                dispatch({ type: PREVIOUS_TARGET_REMOVED })
              })
            }
          }
        }
      })
    }
  }
}

const saveAtTransferLocation = (dispatch, shipmentFromState, locationName) => {
  const shipment = clone(shipmentFromState)
  savingNotification(dispatch, locationName, shipment._deleted)
  return client.get(`${db.getDBName(locationName)}/${shipment._id}`).then(response => {
    delete shipment._rev
    // if our target already exists, grab its current rev
    if (response.body._rev) {
      shipment._rev = response.body._rev
    }
    return client.put(`${db.getDBName(locationName)}/${shipment._id}`, shipment).then(response => {
      saveNotification(dispatch, locationName, shipment._deleted)
    })
  })
}

const savingNotification = (dispatch, location, deleted) => {
  const savingOrDeleting = deleted ? 'Deleting' : 'Saving'
  showNote(`${savingOrDeleting} shipment at ${location.toUpperCase()}`, false)(dispatch)
}

const saveNotification = (dispatch, location, deleted) => {
  const savedOrDeleted = deleted ? 'deleted' : 'saved'
  showNote(`Shipment ${savedOrDeleted} at ${location.toUpperCase()}`)(dispatch)
}
