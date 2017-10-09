import Moment from 'moment'
import editshipmentReducer, {
  startNewShipmentAction,
  updateShipmentAction
} from 'editshipment'
import {getShipment, dateWithoutTime} from 'test-utils'

import chai from 'chai'
const expect = chai.expect

const expectedUsername = 'testuser'
const today = dateWithoutTime(new Date().toISOString())

const newShipmentState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'moriana_test_warehouse', 'receive'))
const existingShipmentState = editshipmentReducer({
  shipment: getShipment('receive'),
  shipmentType: 'receive',
  isNew: true
}, {})

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
      const editedState = editshipmentReducer(existingShipmentState, updateShipmentAction(
        'transaction', { item: 'Test item', category: 'test category', quantity: '3' }))
      expect(dateWithoutTime(editedState.shipment.updated)).eq(today)
    },

    'should include the given username as a shipment attribute' () {
      const editedState = editshipmentReducer(existingShipmentState, updateShipmentAction(
        'transaction', { item: 'Test item', category: 'test category', quantity: '3' }, expectedUsername))
      expect(editedState.shipment.username).eq(expectedUsername)
    },

    'should include a username and a timestamp on a new transaction' () {
      const editedState = editshipmentReducer(existingShipmentState, updateShipmentAction(
        'transaction', { item: 'Test item', category: 'test category', quantity: '3' }, expectedUsername))
      const {username, updated} = editedState.shipment.transactions[0]
      expect(username).eq(expectedUsername)
      expect(dateWithoutTime(updated)).eq(today)
    }
  }

}
