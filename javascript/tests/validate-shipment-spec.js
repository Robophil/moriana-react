import Moment from 'moment'
import editshipmentReducer, {
  updateShipmentAction
} from 'editshipment'

import chai from 'chai'
const expect = chai.expect

const partialShipment = {
  date: new Date().toISOString(),
  from: 'test warehouse',
  fromType: 'I',
  to: 'test dispensary',
  toType: 'I',
  transactions: [],
  totalValue: 0,
  totalTransactions: 0
}

const state = editshipmentReducer({isValid: true, shipment: partialShipment}, updateShipmentAction(
  'date', null))

export default {
  'Editing a shipment:': {
    // 'removing the required fields should return a state with isValid: false' () {
    //   expect(state.isValid).eq(false)
    // },
    // 'should default to location to current location name ' () {
    //   expect(receiveState.shipment.to).eq('test warehouse')
    // }
  },

}
