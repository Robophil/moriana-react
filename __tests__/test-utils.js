import Moment from 'moment'
import {clone} from 'utils/utils'

export const getRoute = (params = {}) => {
  return { route: { dbName: 'moriana_test_warehouse', currentLocationName: 'test warehouse', path: '/', params } }
}

export const getShipment = (shipmentType = 'receive') => {
  const shipment = {
    id: 'dummy_id',
    date: '2017-03-08T07:02:05.687Z',
    from: 'test warehouse',
    fromType: 'I',
    to: 'test dispensary',
    toType: 'I',
    updated: '2017-03-08T07:16:40.289Z',
    totalTransactions: 1,
    totalValue: 0,
    transactions: []
  }
  if (shipmentType === 'receive') {
    Object.assign(shipment, {
      to: 'test warehouse',
      toType: 'I',
      from: 'test supplier',
      fromType: 'E'
    })
  }
  return shipment
}

export const getShipments = (n = 10) => {
  return [...Array(n).keys()].map(i => {
    return clone(getShipment('transfer'))
  })
}

export const getTransactions = (numberBatches = 2, numberTransactions = 10) => {
  const items = ['a item', 'b item', 'c item', 'd item', 'e item', 'f item', 'g item']
  const expirations = [...Array(numberBatches).keys()].map(i => Moment().subtract(i, 'months').toISOString())
  const transaction = {
    category: 'test category',
    date: '2017-06-23T15:01:25.165Z',
    expiration: '2020-09-01T00:00:00.000Z',
    from: 'test warehouse',
    id: 'test_transaction_id',
    item: 'test item abc',
    lot: null,
    quantity: 1,
    to: 'test dispensary',
    unitPrice: 10,
    username: 'testuser',
    value: 1,
    _id: 'test_transaction_id'
  }
  return [...Array(numberTransactions).keys()].map(i => {
    const item = items[i % numberBatches]
    const expiration = expirations[i % numberBatches]
    return Object.assign({}, transaction, { item, expiration })
  })
}

export const dateWithoutTime = (date) => {
  return date.split(':')[0]
}

// export const testExpiration = '2020-09-01T00:00:00.000Z'
// const receiveTransactions = [
//   { item: 'cde', category: 'catB', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
//   { item: 'cde', category: 'catB', expiration: null, lot: '', quantity: 1, unitPrice: 10 },
//   { item: 'abc', category: 'catA', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
//   { item: 'abc', category: 'catA', expiration: testExpiration, lot: null, quantity: 1, unitPrice: 10 },
//   { item: 'bcd', category: 'catA', expiration: '', lot: 'abc', quantity: 1, unitPrice: 10 },
//   { item: 'bcd', category: 'catA', expiration: null, lot: 'abc', quantity: 1, unitPrice: 10 },
//   { item: 'bcd', category: 'catA', expiration: testExpiration, lot: 'abc', quantity: 1, unitPrice: 10 },
//   { item: 'efg', category: 'catA', expiration: testExpiration, lot: 'abc', quantity: 1, unitPrice: 10 }
// ]
//
// const transferTransactions = [
//   { item: 'def', category: 'catC', expiration: '', lot: 'abc', quantity: 1, unitPrice: 10 },
//   { item: 'def', category: 'catC', expiration: null, lot: 'abc', quantity: 1, unitPrice: 10 },
//   { item: 'cde', category: 'catB', expiration: testExpiration, lot: '', quantity: 1, unitPrice: 10 },
//   { item: 'cde', category: 'catB', expiration: null, lot: null, quantity: 1, unitPrice: 10 }
// ]
//
// export const shipmentsFixtures = [
//   { date: '2017-03-08T07:02:05.687Z', from: 'test supplier', to: 'test warehouse', transactions: receiveTransactions },
//   { date: '2017-04-08T07:02:05.687Z', from: 'test warehouse', to: 'test dispensary', transactions: transferTransactions }
// ]

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
