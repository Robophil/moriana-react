import chai from 'chai';
const expect = chai.expect
import Moment from 'moment'
import reportsReducer from 'reports'
import { defaultReportsState, receivedAllAction, runReportAction } from 'reports'
import { shipmentsFixtures, testExpiration } from 'report-fixtures'

const defaultFiltersState = reportsReducer(defaultReportsState, receivedAllAction(shipmentsFixtures, {}))
const lastMonthName = Moment.utc().subtract(1, 'months').startOf('month').format('MMMM YYYY')

const consumptionState = reportsReducer(defaultFiltersState, runReportAction('consumption'))
const consumptionStateItemLevel = reportsReducer(defaultFiltersState, runReportAction('consumption', 'batches', 1))

export default {
  'Report setup': {
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
      expect(defaultFiltersState.allItems['abc__catA'][`${testExpiration}__null`][0].quantity).eq(1)
      expect(defaultFiltersState.allItems['bcd__catA'][`null__abc`].length).eq(2)
    },
  },
  'Running a report': {
    'should return report rows and report headers' () {
      expect(consumptionState.reportRows instanceof Array).eq(true)
      expect(consumptionState.reportHeaders instanceof Array).eq(true)
    },
    'should default to batch level' () {
      expect(consumptionState.reportRows.length).gt(5)
    },
    'should filter out batch rows with all zeros but leave one row at the item level' () {
      expect(consumptionState.reportRows.length).eq(6)
    },
    'should order alphabetically' () {
      const expectedOrder = ['abc', 'bcd', 'bcd', 'cde', 'cde', 'def', 'efg']
      consumptionState.reportRows.forEach((row, i) => {
        expect(row.item).eq(expectedOrder[i])
      })
    },
  },
  'Running a report with item level filter': {
    'should return rows condensed to item level' () {
      console.log(consumptionStateItemLevel.reportRows)
      expect(consumptionStateItemLevel.reportRows.length).eq(5)
      expect(consumptionStateItemLevel.reportRows[0].expiration).eq(undefined)
    },
  }

}
