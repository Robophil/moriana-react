import editshipmentReducer, {
  updateShipmentAction
} from 'editshipment'
import {getShipment} from 'test-utils'

import chai from 'chai'
const expect = chai.expect

const initialState = editshipmentReducer({ shipment: getShipment('transfer') }, {})

const testitem = 'Test item'
const testCategory = 'Test category'
const testExpiration = '2020-09-01T00:00:00.000Z'

const editedTransactions = [
  { item: testitem, category: testCategory, quantity: 1, expiration: testExpiration, lot: 'test lot', unitPrice: 10 }
]

const getEditAction = (editedTransactions) => {
  return updateShipmentAction('transfer_transactions', {editedTransactions, item: testitem, category: testCategory}, testusername )
}

const testusername = 'testusername'

export default {

  'Adding a transfer transaction:': {
    'on an empty shipment should include it as the first item' () {
      const editedState = editshipmentReducer(initialState, getEditAction(editedTransactions))
      const transactions = editedState.shipment.transactions
      expect(transactions.length).eq(1)
    },

  }

}
