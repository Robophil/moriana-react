import Moment from 'moment'
import editshipmentReducer, {
  startNewShipmentAction,
  updateShipmentAction
} from 'editshipment'

import {dateWithoutTime} from 'test-utils'

import chai from 'chai'
const expect = chai.expect


// TODO: move this into function & create new state each test
const firstTransaction = { item: 'Test item', category: 'test category', quantity: '3' }
const receiveState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'testwarehouse', 'receive'))
const editedState = editshipmentReducer(
  receiveState,
  updateShipmentAction('receive_transaction', { editedTransaction: firstTransaction })
)

export default {
  'Start new receive shipment action:': {
    'should return a shipment defaulted to the current date' () {
      expect(dateWithoutTime(receiveState.shipment.date)).eq(dateWithoutTime(new Date().toISOString()))
    },
    'should default to location to current location name ' () {
      expect(receiveState.shipment.to).eq('test warehouse')
    }
  },
  'Update receive shipment action:': {
    'a new receive transaction should update shipment totalValue and totalTransactions' () {
      const editedTransaction = { item: 'ABC test item', category: 'test category', unitPrice: '1', quantity: '10' }
      expect(editedState.shipment.totalTransactions).eq(1)
      expect(editedState.shipment.totalValue).eq(0)
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
      expect(newState.shipment.totalTransactions).eq(2)
      expect(newState.shipment.totalValue).eq(10)
    },

    'a new receive transaction should be the first transaction' () {
      const editedTransaction = { item: 'New Test item', category: 'test category', quantity: '3' }
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
      expect(newState.shipment.transactions[0].item).eq('New Test item')
      expect(newState.shipment.transactions[1].item).eq('Test item')
    },

    'editing a receive transaction should replace the transaction in the position given' () {
      const transactionA = { item: 'ABC Item', category: 'test category', quantity: '8' }
      const transactionB = { item: 'BCD Item', category: 'test category', quantity: '3' }
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction: transactionA }))
      const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', { editedTransaction: transactionB }))
      // we now have transactions:  test item, abc item (qty 8), and bcd item
      expect(newState2.shipment.transactions.length).eq(3)
      transactionA.quantity = 1
      const newState3 = editshipmentReducer(newState2, updateShipmentAction('receive_transaction', { editedTransaction: transactionA, index: 1 }))
      expect(newState3.shipment.transactions[1].item).eq('ABC Item')
      expect(newState3.shipment.transactions[1].quantity).eq(1)
      expect(newState3.shipment.transactions.length).eq(3)
    },

    'editing a receive transaction should udate shipment totalValue and totalTransactions' () {
      expect(editedState.shipment.totalTransactions).eq(1)
      expect(editedState.shipment.totalValue).eq(0)
      const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
      expect(newState.shipment.totalTransactions).eq(2)
      expect(newState.shipment.totalValue).eq(5)
      editedTransaction.quantity = 2
      const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', { editedTransaction, index: 0 }))
      expect(newState2.shipment.totalTransactions).eq(2)
      expect(newState2.shipment.totalValue).eq(10)
    },

    'deleting a receive transaction should remove it from the shipment' () {
      const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
      const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', {deleted: true, index: 0}))
      expect(newState2.shipment.transactions.length).eq(1)
      expect(newState2.shipment.transactions[0].item).eq('Test item')
    },

    'deleting a receive transaction should update totalValue and totalTransactions' () {
      const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
      const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
      const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', {deleted: true, index: 1}))
      expect(newState2.shipment.totalTransactions).eq(1)
      expect(newState2.shipment.totalValue).eq(5)
      const newState3 = editshipmentReducer(newState2, updateShipmentAction('receive_transaction', {deleted: true, index: 0}))
      expect(newState3.shipment.totalTransactions).eq(0)
      expect(newState3.shipment.totalValue).eq(0)
    }

  }

}
