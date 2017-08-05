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

console.log(defaultFiltersState)

export default {
  'receivedAllAction': {
    'should return a list of available date filters' () {
      expect(defaultFiltersState.allDateFilters[0].name).eq(lastMonthName)
    },
    'should return a list of available category filters' () {
      expect(defaultFiltersState.allCategoryFilters[0].name).eq('All Categories')
      expect(defaultFiltersState.allCategoryFilters[1].name).eq('catA')
    },
    'should return a list of available batch filters' () {
      expect(defaultFiltersState.allBatchFilters[0].itemLevel).eq(false)
      expect(defaultFiltersState.allBatchFilters[1].itemLevel).eq(true)
    },
    'should default set filters to their first available filter option' () {
      expect(defaultFiltersState.categoryFilter.name).eq('All Categories')
      expect(defaultFiltersState.dateFilter.name).eq(lastMonthName)
      expect(defaultFiltersState.batchFilter.itemLevel).eq(false)
    },
    'should return a hash of all available items' () {
      expect(defaultFiltersState.allItems['abc__catA']).not.eq(undefined)
      expect(defaultFiltersState.allItems['abc__catA'][`${expiration}__null`][0].quantity).eq(1)
      expect(defaultFiltersState.allItems['bcd__catA'][`null__abc`].length).eq(2)
    },
  },
  'runReportAction': {
    'should return report rows and report headers' () {
      expect(consumptionState.reportRows instanceof Array).eq(true)
      expect(consumptionState.reportHeaders instanceof Array).eq(true)
    },
  }

}
