import Moment from 'moment'
import editshipmentReducer, {
  startNewShipmentAction,
  updateShipmentAction
} from 'editshipment'
import {getShipment, dateWithoutTime} from 'test-utils'

import chai from 'chai'
const expect = chai.expect

const testUsername = 'testuser'
const today = dateWithoutTime(new Date().toISOString())

const newShipmentState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'moriana_test_warehouse', 'receive'))
const existingShipmentState = editshipmentReducer({ isValid: true, shipment: getShipment('receive'), }, {})
const editedTransaction = { item: 'Test item', category: 'test category', quantity: 3 }

export default {
  'Start new shipment action:': {
    'should return a shipment with created and updated timestamps equal to today' () {
      const {created, updated } = newShipmentState.shipment
      expect(dateWithoutTime(created)).eq(today)
      expect(dateWithoutTime(updated)).eq(today)
    }
  },

  'Updating a shipment action:': {
    'should include an updated attribute equal to today' () {
      const editedState = editshipmentReducer(existingShipmentState,
        updateShipmentAction('receive_transaction', { editedTransaction } ))
      expect(dateWithoutTime(editedState.shipment.updated)).eq(today)
    },

    'should include a username on a new transaction' () {
      const editedState = editshipmentReducer(existingShipmentState,
        updateShipmentAction('receive_transaction', {editedTransaction}, testUsername))
      expect(editedState.shipment.transactions[0].username).eq(testUsername)
    },

    'should include a timestamp on a new transaction' () {
      const editedState = editshipmentReducer(existingShipmentState,
        updateShipmentAction('receive_transaction', { editedTransaction }, testUsername))
      expect(dateWithoutTime(editedState.shipment.transactions[0].updated)).eq(today)
    }
  }

}
