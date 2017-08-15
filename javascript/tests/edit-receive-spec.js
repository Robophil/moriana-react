import Moment from 'moment'
import editshipmentReducer, {startNewShipmentAction, updateShipmentAction} from 'editshipment'

import chai from 'chai'
const expect = chai.expect

const receiveState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'receive'))
const editedState = editshipmentReducer(receiveState, updateShipmentAction(
  'receive_transactions', { item: 'Test item', category: 'test category', quantity: '3' }))

export default {
  'Start new shipment action:': {
    'should return a shipment defaulted to the current date' () {
      expect(receiveState.shipment.date.split(':')[0]).eq(new Date().toISOString().split(':')[0])
    },
    'should default to location to current location name ' () {
      expect(receiveState.shipment.to).eq('test warehouse')
    }
  },
  'Update shipment action:': {
    'a new receive transaction should update shipment totalValue and totalTransactions' () {
      expect(editedState.shipment.totalTransactions).eq(1)
      expect(editedState.shipment.totalValue).eq(0)
      const newState = editshipmentReducer(editedState, updateShipmentAction(
        'receive_transactions', { item: 'ABC test item', category: 'test category', unitPrice: '1', quantity: '10' }))
      expect(newState.shipment.totalTransactions).eq(2)
      expect(newState.shipment.totalValue).eq(10)
    },

    'a new receive transaction should be the first transaction' () {
      const newState = editshipmentReducer(editedState, updateShipmentAction(
        'receive_transactions', { item: 'New Test item', category: 'test category', quantity: '3' }))
      expect(newState.shipment.transactions[0].item).eq('New Test item')
      expect(newState.shipment.transactions[1].item).eq('Test item')
    },

    'editing a receive transaction should replace the transaction in the position given' () {
      const newState = editshipmentReducer(editedState, updateShipmentAction(
        'receive_transactions', { item: 'ABC Item', category: 'test category', quantity: '8' }))
      const newState2 = editshipmentReducer(newState, updateShipmentAction(
        'receive_transactions', { item: 'BCD Item', category: 'test category', quantity: '3' }))
      // we now have transactions:  test item, abc item (qty 8), and bcd item
      expect(newState2.shipment.transactions.length).eq(3)
      const newState3 = editshipmentReducer(newState2, updateShipmentAction(
        'receive_transactions', { editIndex: 1, item: 'ABC Item', category: 'test category', quantity: '1' }))
      expect(newState3.shipment.transactions[1].item).eq('ABC Item')
      expect(newState3.shipment.transactions[1].quantity).eq(1)
      expect(newState3.shipment.transactions.length).eq(3)
    },

    'editing a receive transaction should udate shipment totalValue and totalTransactions' () {
      expect(editedState.shipment.totalTransactions).eq(1)
      expect(editedState.shipment.totalValue).eq(0)
      const newState = editshipmentReducer(editedState, updateShipmentAction(
        'receive_transactions', { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }))
      expect(newState.shipment.totalTransactions).eq(2)
      expect(newState.shipment.totalValue).eq(5)
      const newState2 = editshipmentReducer(newState, updateShipmentAction(
        'receive_transactions', { editIndex: 0, item: 'ABC Item', category: 'test category', quantity: '2', unitPrice: '5' }))
      expect(newState2.shipment.totalTransactions).eq(2)
      expect(newState2.shipment.totalValue).eq(10)
    }
  }

}
