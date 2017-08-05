import ReactDOMServer from 'react-dom/server'
import Moment from 'moment'

export const getRoute = (params = {}) => {
  return { route: { dbName: 'moriana_test_warehouse', currentLocationName: 'test warehouse', path: '/', params } }
}

export const getShipments = (n=10) => {
  const shipment = {
    id: 'dummy_id',
    value: 0,
    date: '2017-03-08T07:02:05.687Z',
    from: 'test warehouse',
    to: 'test dispensary',
    updated: '2017-03-08T07:16:40.289Z',
    totalTransactions: 1,
    username: 'testuser'
  }
  return [...Array(n).keys()].map(i => {
    return Object.assign({}, shipment, { date: new Date().toISOString() })
  })
}

export const getElement = (component) => {
  const span = document.createElement('span')
  span.innerHTML = ReactDOMServer.renderToStaticMarkup(component.render())
  return span
}

export const getTransactions = (n_batches=2, n_transactions=10) => {
  const items = ['a item', 'b item', 'c item', 'd item', 'e item', 'f item', 'g item']
  const expirations = [...Array(n_batches).keys()].map(i => Moment().subtract(i, 'months').toISOString())
  const transaction = {
    category: 'test category',
    date: '2017-06-23T15:01:25.165Z',
    expiration: '2020-09-01T00:00:00.000Z',
    from: 'test warehouse',
    id: 'test_transaction_id',
    item: 'test item abc',
    lot: '',
    quantity: 1,
    to: 'test dispensary',
    unitPrice: 10,
    username: 'testuser',
    value: 1,
    _id: 'test_transaction_id'
  }
  return [...Array(n_transactions).keys()].map(i => {
    const item = items[i % n_batches]
    const expiration = expirations[i % n_batches]
    return Object.assign({}, transaction, { item, expiration })
  })
}
