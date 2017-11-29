import Moment from 'moment'
import editshipmentReducer, {
  updateShipmentAction
} from 'store/editshipment'

const initState = {
  shipment: {
    date: new Date().toISOString(),
    from: 'test warehouse',
    fromType: 'I',
    to: 'test dispensary',
    toType: 'I',
    transactions: [],
    totalValue: 0,
    totalTransactions: 0
  },
  isValid: true,
  shipmentType: 'receive'
}

test('removing date should be invalid', () => {
  // date
  const state = editshipmentReducer(initState, updateShipmentAction(
    'date', null))
  expect(state.isValid).toBe(false)
  const validState = editshipmentReducer(state, updateShipmentAction(
    'date', new Date().toISOString()))
  expect(validState.isValid).toBe(true)
})

test('removing from or to should be invalid', () => {
  // from
  const state = editshipmentReducer(initState, updateShipmentAction(
    'from', {}))
  expect(state.isValid).toBe(false)
})

test('adding an invalid transaction should be invalid', () => {
  // from
  const state = editshipmentReducer(initState, updateShipmentAction(
    'receive_transaction', { editedTransaction: {item: 'abc', 'category': 'cde', quantity: 'not a number'} }))
  expect(state.isValid).toBe(false)
})
