import chai from 'chai';
const expect = chai.expect
import Moment from 'moment'
import reportsReducer from 'reports'
import { defaultReportsState, receivedAllAction } from 'reports'

const expiration = '2020-09-01T00:00:00.000Z'
const receiveTransactions = [
  { item: 'abc', category: 'catA', expiration, lot: '', quantity: 1, unitPrice: 10 }
]

const shipments = [
  { date: '2017-03-08T07:02:05.687Z', from: 'test warehouse', to: 'test dispensary', transactions: receiveTransactions }
]

const state = reportsReducer(defaultReportsState, receivedAllAction(shipments, {}))
const lastMonthName = Moment.utc().subtract(1, 'months').startOf('month').format('MMMM YYYY')

export default {
  'receivedAllAction': {
    'should return a list of available date filters' () {
      expect(state.allDateFilters[0].name).eq(lastMonthName)
    },
    'should return a list of available category filters' () {
      expect(state.allCategoryFilters[0].name).eq('All Categories')
      expect(state.allCategoryFilters[1].name).eq('catA')
    },
    'should return a list of available batch filters' () {
      expect(state.allBatchFilters[0].itemLevel).eq(false)
      expect(state.allBatchFilters[1].itemLevel).eq(true)
    },
    'should default set filters to their first available filter option' () {
      expect(state.categoryFilter.name).eq('All Categories')
      expect(state.dateFilter.name).eq(lastMonthName)
      expect(state.batchFilter.itemLevel).eq(false)
    },
  },
  'runReportAction': {
    'should return all available items' () {
      expect(state.allDateFilters[0].name).eq(lastMonthName)
    },
  }

}
