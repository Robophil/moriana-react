import chai from 'chai';
const expect = chai.expect;
import testUtils from 'test-utils'
import { getBatches, parseResponse } from 'stock'

// Our headers are: ['from', 'item', 'category', 'expiration', 'lot', 'unitPrice', 'date', '_id', 'from', 'to', 'username']
const stockResponse = {'total_rows':104778,'offset':91915,'rows':[
  {key:['test warehouse','test item','test category','2015-09-01T00:00:00.000Z',null,0,'2015-07-21T00:00:00.000Z','testid','test warehouse','test dispensary','testuser'],'value':-1},
  {key:['test warehouse','test item','test category','','test lot',0,'2015-07-16T00:00:00.000Z','testid','test warehouse','test dispensary','testuser'],'value':-5},
  {key:['test warehouse','test item','test category','2015-10-01T00:00:00.000Z',null,0,'2015-07-15T00:00:00.000Z','testid','test warehouse','test dispensary','testuser'],'value':-1}
]}

export default {
  'getBatches reducer': {
    'should return batches in First Expiration in First Out (FEFO)' () {
      const transactions = testUtils.getTransactions()
      const batches = getBatches(transactions)
      expect(batches[0].expiration < batches[1].expiration).eq(true)
    }
  },

  'parse stock for stock page': {
    'should not filter on batch if no filter present' () {
      const parsed = parseResponse(stockResponse, null)
      expect(parsed.transactions.length).eq(3)
      expect(parsed.totalTransactions).eq(3)
    },
    'should filter on expiration' () {
      const parsed = parseResponse(stockResponse, '2015-10-01T00:00:00.000Z__')
      expect(parsed.transactions.length).eq(1)
      expect(parsed.totalTransactions).eq(1)
    },
    'should filter on lot' () {
      const parsed = parseResponse(stockResponse, '__test lot')
      expect(parsed.transactions.length).eq(1)
      expect(parsed.totalTransactions).eq(1)
      expect(parsed.transactions[0].lot).eq('test lot')
    },
  }
}
