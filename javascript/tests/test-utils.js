import ReactDOMServer from 'react-dom/server'
import Moment from 'moment'
import {clone} from 'utils'

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

export const getElement = (component) => {
  const span = document.createElement('span')
  span.innerHTML = ReactDOMServer.renderToStaticMarkup(component.render())
  return span
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
