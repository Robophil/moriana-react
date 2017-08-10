import chai from 'chai';
const expect = chai.expect
import Moment from 'moment'
import reportsReducer from 'reports'
import { defaultReportsState, receivedAllAction, runReportAction } from 'reports'
import { shipmentsFixtures } from 'report-fixtures'

const defaultFiltersState = reportsReducer(defaultReportsState, receivedAllAction(shipmentsFixtures, 'test warehouse', {}))
const consumptionState = reportsReducer(defaultFiltersState, runReportAction('consumption'))
const dateFilter = {
  name: 'April 2017',
  startDate: new Date('2017-04-01').toISOString(),
  endDate: new Date('2017-05-01').toISOString(),
}
const stateFilteredOnDates = reportsReducer(
    defaultFiltersState, runReportAction('consumption', 'dates', null, dateFilter))

export default {
  'Consumption reports with no date filters': {
    'opening qty should be total received quantity minus transferred qty' () {
      // abc is one batch with 2 received qty
      expect(consumptionState.reportRows[0].opening).eq(2)
      // bcd is two batch with 1 received qty each
      expect(consumptionState.reportRows[1].opening).eq(2)
      expect(consumptionState.reportRows[2].opening).eq(1)
      // cde is two batches but both zeros
      expect(consumptionState.reportRows[3].opening).eq(0)
      expect(consumptionState.reportRows[3].opening).eq(0)
      // def is two transfer outs of same batch with 1 qty each, no receives
      expect(consumptionState.reportRows[4].opening).eq(-2)
    },
    'closing quantities should be equal to openings' () {
      expect(consumptionState.reportRows[0].closing).eq(2)
      expect(consumptionState.reportRows[1].closing).eq(2)
      expect(consumptionState.reportRows[2].closing).eq(1)
      expect(consumptionState.reportRows[3].closing).eq(0)
      expect(consumptionState.reportRows[3].closing).eq(0)
      expect(consumptionState.reportRows[4].closing).eq(-2)
    },
  },
  'Consumption report with date filtered over second shipment': {
    'closing qty over range should be sum of transactions to date +/- any in range' () {
      expect(stateFilteredOnDates.reportRows[3].opening).eq(1)
      expect(stateFilteredOnDates.reportRows[4].opening).eq(1)
      expect(stateFilteredOnDates.reportRows[3].closing).eq(0)
      expect(stateFilteredOnDates.reportRows[4].closing).eq(0)
    },
  }

}
