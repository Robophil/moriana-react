import {getTransactions} from './test-utils'
import { getBatches, parseResponse } from 'store/stock'
import { searchItems } from 'store/items'

// Our headers are: ['from', 'item', 'category', 'expiration', 'lot', 'unitPrice', 'date', '_id', 'from', 'to', 'username']
const stockResponse = {
  'total_rows': 104778,
  'offset': 91915,
  'rows':
  [
    {key: ['test warehouse', 'test item', 'test category', '2015-09-01T00:00:00.000Z', null, 0, '2015-07-21T00:00:00.000Z', 'testid', 'test warehouse', 'test dispensary', 'testuser'], 'value': -1},
    {key: ['test warehouse', 'test item', 'test category', '', 'test lot', 0, '2015-07-16T00:00:00.000Z', 'testid', 'test warehouse', 'test dispensary', 'testuser'], 'value': -5},
    {key: ['test warehouse', 'test item', 'test category', '2015-10-01T00:00:00.000Z', null, 0, '2015-07-15T00:00:00.000Z', 'testid', 'test warehouse', 'test dispensary', 'testuser'], 'value': -1}
  ]
}

test('getBatches reducer returns batches in First Expiration in First Out (FEFO)', () => {
  const transactions = getTransactions()
  const batches = getBatches(transactions)
  expect(batches[0].expiration < batches[1].expiration).toBe(true)
})

describe('parse stock for stock page', () => {
  test('should not filter on batch if no filter present', () => {
    const parsed = parseResponse(stockResponse, null)
    expect(parsed.transactions.length).toBe(3)
    expect(parsed.totalTransactions).toBe(3)
  })
  test('should filter on expiration', () => {
    const parsed = parseResponse(stockResponse, '2015-10-01T00:00:00.000Z__')
    expect(parsed.transactions.length).toBe(1)
    expect(parsed.totalTransactions).toBe(1)
  })
  test('should filter on lot', () => {
    const parsed = parseResponse(stockResponse, '__test lot')
    expect(parsed.transactions.length).toBe(1)
    expect(parsed.totalTransactions).toBe(1)
    expect(parsed.transactions[0].lot).toBe('test lot')
  })
})

test('search items return items where the search query is at the zero position of the item name first', () => {
  const items = [
    { item: 'abcmet', category: 'test cat'},
    { item: 'met', category: 'test cat'},
  ]
  const query = 'met'
  const response = searchItems(items, query)
  expect(response[0].item.indexOf(query)).toBe(0)
})
