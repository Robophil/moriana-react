import chai from 'chai';
const expect = chai.expect
import Moment from 'moment'
import reportsReducer from 'reports'
import { defaultReportsState, receivedAllAction, runReportAction } from 'reports'

const expiration = '2020-09-01T00:00:00.000Z'
const receiveTransactions = [
  { item: 'abc', category: 'catA', expiration, lot: '', quantity: 1, unitPrice: 10 },
  { item: 'abc', category: 'catA', expiration, lot: null, quantity: 1, unitPrice: 10 },
  { item: 'bcd', category: 'catA', expiration: '', lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'bcd', category: 'catA', expiration: null, lot: 'abc', quantity: 1, unitPrice: 10 },
]

const shipments = [
  { date: '2017-03-08T07:02:05.687Z', from: 'test warehouse', to: 'test dispensary', transactions: receiveTransactions }
]

const defaultFiltersState = reportsReducer(defaultReportsState, receivedAllAction(shipments, {}))
const lastMonthName = Moment.utc().subtract(1, 'months').startOf('month').format('MMMM YYYY')

const consumptionState = reportsReducer(defaultFiltersState, runReportAction('consumption'))

export default {
  'consumption report headers': {
    'should return consumption headers defaulted to batch level' () {
      expect(consumptionState.reportHeaders[0].key).eq('item')
      expect(consumptionState.reportHeaders[2].key).eq('expiration')
    },
    'should return report rows at batch level with items and categories' () {
      expect(consumptionState.reportRows.length).eq(2)
      expect(consumptionState.reportRows[0].item).eq('abc')
      expect(consumptionState.reportRows[1].item).eq('bcd')
    },
  }

}
