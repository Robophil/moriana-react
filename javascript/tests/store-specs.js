import chai from 'chai';
const expect = chai.expect;
import testUtils from 'test-utils'
import { getBatches } from 'stock'

export default {
  'getBatches reducer': {
    'should return batches in First Expiration in First Out (FEFO)' () {
      const transactions = testUtils.getTransactions()
      const batches = getBatches(transactions)
      expect(batches[0].expiration < batches[1].expiration).eq(true)
    }
  }
}
