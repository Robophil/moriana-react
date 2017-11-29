import Moment from 'moment'
import editshipmentReducer, {
  startNewShipmentAction,
  updateShipmentAction
} from 'store/editshipment'
import {getShipment, dateWithoutTime} from './test-utils'

const testUsername = 'testuser'
const today = dateWithoutTime(new Date().toISOString())

const newShipmentState = editshipmentReducer(null, startNewShipmentAction('test warehouse', 'moriana_test_warehouse', 'receive'))
const existingShipmentState = editshipmentReducer({ isValid: true, shipment: getShipment('receive'), }, {})
const editedTransaction = { item: 'Test item', category: 'test category', quantity: 3 }


describe('Start new shipment action', () => {
  test('should return a shipment with created and updated timestamps equal to today', () => {
    const {created, updated } = newShipmentState.shipment
    expect(dateWithoutTime(created)).toBe(today)
    expect(dateWithoutTime(updated)).toBe(today)
  })
})

describe('Updating a shipment action:', () => {
  test('should include an updated attribute equal to today', () => {
    const editedState = editshipmentReducer(existingShipmentState,
      updateShipmentAction('receive_transaction', { editedTransaction } ))
    expect(dateWithoutTime(editedState.shipment.updated)).toBe(today)
  })

  test('should include a username on a new transaction', () => {
    const editedState = editshipmentReducer(existingShipmentState,
      updateShipmentAction('receive_transaction', {editedTransaction}, testUsername))
    expect(editedState.shipment.transactions[0].username).toBe(testUsername)
  })

  test('should include a timestamp on a new transaction', () => {
    const editedState = editshipmentReducer(existingShipmentState,
      updateShipmentAction('receive_transaction', { editedTransaction }, testUsername))
    expect(dateWithoutTime(editedState.shipment.transactions[0].updated)).toBe(today)
  })
})
