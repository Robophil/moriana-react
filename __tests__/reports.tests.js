import {consumptionReport} from 'utils/consumption-report'

const allItems = {
  byItem: [
    { item: 'test item', category: 'test category', transactions: [
      { quantity: -15, date: new Date('2015-01-15').toISOString() },
      { quantity: -15, date: new Date('2015-06-15').toISOString() },
      { quantity: -15, date: new Date('2015-07-15').toISOString() },
      { quantity: -15, date: new Date('2015-08-15').toISOString() },
      { quantity: -15, date: new Date('2015-09-15').toISOString() },
      { quantity: -15, date: new Date('2015-10-15').toISOString() },
    ] }
  ]
}

describe('Consumption report', () => {
  test('returns rows with AMC details for the last six months', () => {
    const dateRange = { startDate: '2015-10-01', endDate: '2015-11-15' }
    const {displayRows} = consumptionReport(allItems, false, dateRange)
    expect(displayRows[0].amc).toBe(13)
  })
})
