import Moment from 'moment'
import editshipmentReducer, {
  updateShipmentAction
} from 'editshipment'

import chai from 'chai'
const expect = chai.expect

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

export default {
  'Editing a shipment:': {
    'removing date should be invalid' () {
      // date
      const state = editshipmentReducer(initState, updateShipmentAction(
        'date', null))
      expect(state.isValid).eq(false)
      const validState = editshipmentReducer(state, updateShipmentAction(
        'date', new Date().toISOString()))
      expect(validState.isValid).eq(true)
    },
    'removing from or to should be invalid' () {
      // from
      const state = editshipmentReducer(initState, updateShipmentAction(
        'from', {}))
      expect(state.isValid).eq(false)
    },
    'adding an invalid transaction should be invalid' () {
      // from
      const state = editshipmentReducer(initState, updateShipmentAction(
        'transaction', { item: 'abc', 'category': 'cde', quantity: 'not a number' }))
      expect(state.isValid).eq(false)
    }
  },

}
