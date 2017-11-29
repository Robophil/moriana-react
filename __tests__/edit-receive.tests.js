import Moment from 'moment'
import editshipmentReducer, {
  startNewShipmentAction,
  updateShipmentAction
} from 'store/editshipment'
import {dateWithoutTime} from './test-utils'

// TODO: move this into function & create new state each test
const firstTransaction = { item: 'Test item', category: 'test category', quantity: '3' }
const receiveState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'testwarehouse', 'receive'))
const editedState = editshipmentReducer(
  receiveState,
  updateShipmentAction('receive_transaction', { editedTransaction: firstTransaction })
)

describe('Starting a new receive shipment action', () => {
  test('returns a shipment defaulted to the current date', () => {
    expect(dateWithoutTime(receiveState.shipment.date)).toBe(dateWithoutTime(new Date().toISOString()))
  })
  test('defaults to location to current location name', () => {
    expect(receiveState.shipment.to).toBe('test warehouse')
  })
})


describe('Update receive shipment action:', () => {

  test('a new receive transaction should update shipment totalValue and totalTransactions', () => {
    const editedTransaction = { item: 'ABC test item', category: 'test category', unitPrice: '1', quantity: '10' }
    expect(editedState.shipment.totalTransactions).toBe(1)
    expect(editedState.shipment.totalValue).toBe(0)
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
    expect(newState.shipment.totalTransactions).toBe(2)
    expect(newState.shipment.totalValue).toBe(10)
  })

  test('a new receive transaction should be the first transaction', () => {
    const editedTransaction = { item: 'New Test item', category: 'test category', quantity: '3' }
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
    expect(newState.shipment.transactions[0].item).toBe('New Test item')
    expect(newState.shipment.transactions[1].item).toBe('Test item')
  })

  test('editing a receive transaction should replace the transaction in the position given', () => {
    const transactionA = { item: 'ABC Item', category: 'test category', quantity: '8' }
    const transactionB = { item: 'BCD Item', category: 'test category', quantity: '3' }
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction: transactionA }))
    const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', { editedTransaction: transactionB }))
    // we now have transactions:  test item, abc item (qty 8), and bcd item
    expect(newState2.shipment.transactions.length).toBe(3)
    transactionA.quantity = 1
    const newState3 = editshipmentReducer(newState2, updateShipmentAction('receive_transaction', { editedTransaction: transactionA, index: 1 }))
    expect(newState3.shipment.transactions[1].item).toBe('ABC Item')
    expect(newState3.shipment.transactions[1].quantity).toBe(1)
    expect(newState3.shipment.transactions.length).toBe(3)
  })

  test('editing a receive transaction should udate shipment totalValue and totalTransactions', () => {
    expect(editedState.shipment.totalTransactions).toBe(1)
    expect(editedState.shipment.totalValue).toBe(0)
    const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
    expect(newState.shipment.totalTransactions).toBe(2)
    expect(newState.shipment.totalValue).toBe(5)
    editedTransaction.quantity = 2
    const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', { editedTransaction, index: 0 }))
    expect(newState2.shipment.totalTransactions).toBe(2)
    expect(newState2.shipment.totalValue).toBe(10)
  })

  test('deleting a receive transaction should remove it from the shipment', () => {
    const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
    const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', {deleted: true, index: 0}))
    expect(newState2.shipment.transactions.length).toBe(1)
    expect(newState2.shipment.transactions[0].item).toBe('Test item')
  })

  test('deleting a receive transaction should update totalValue and totalTransactions', () => {
    const editedTransaction = { item: 'ABC Item', category: 'test category', quantity: '1', unitPrice: '5' }
    const newState = editshipmentReducer(editedState, updateShipmentAction('receive_transaction', { editedTransaction }))
    const newState2 = editshipmentReducer(newState, updateShipmentAction('receive_transaction', {deleted: true, index: 1}))
    expect(newState2.shipment.totalTransactions).toBe(1)
    expect(newState2.shipment.totalValue).toBe(5)
    const newState3 = editshipmentReducer(newState2, updateShipmentAction('receive_transaction', {deleted: true, index: 0}))
    expect(newState3.shipment.totalTransactions).toBe(0)
    expect(newState3.shipment.totalValue).toBe(0)
  })
})
