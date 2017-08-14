export const testExpiration = '2020-09-01T00:00:00.000Z'
const receiveTransactions = [
  { item: 'cde', category: 'catB', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
  { item: 'cde', category: 'catB', expiration: null, lot: '', quantity: 1, unitPrice: 10 },
  { item: 'abc', category: 'catA', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
  { item: 'abc', category: 'catA', expiration: testExpiration, lot: null, quantity: 1, unitPrice: 10 },
  { item: 'bcd', category: 'catA', expiration: '', lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'bcd', category: 'catA', expiration: null, lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'bcd', category: 'catA', expiration: testExpiration, lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'efg', category: 'catA', expiration: testExpiration, lot: 'abc', quantity: 1, unitPrice: 10 }
]

const transferTransactions = [
  { item: 'def', category: 'catC', expiration: '', lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'def', category: 'catC', expiration: null, lot: 'abc', quantity: 1, unitPrice: 10 },
  { item: 'cde', category: 'catB', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
  { item: 'cde', category: 'catB', expiration: null, lot: null, quantity: 1, unitPrice: 10 }
]

export const shipmentsFixtures = [
  { date: '2017-03-08T07:02:05.687Z', from: 'test supplier', to: 'test warehouse', transactions: receiveTransactions },
  { date: '2017-04-08T07:02:05.687Z', from: 'test warehouse', to: 'test dispensary', transactions: transferTransactions }
]

// result after both shipments: five items, seven batches

// item abc is one batch with 2 quantity
// item bcd is two batches with quantities 1 and 2
// item cde is two batches with 0 quantity each
// item def is one batch with -2 quantity
// item efg is one batch with 1 quantity

// catA should have four batches

// but, requirements are that (when filtering at the batch level) batches with all zeros should be removed
// from the report, and one row should be left for the item itself to show it was all zeros for all batches.
// so our test data actually returns five items and six batches, as cde is two batches of zeros after
// both shipments are executed
