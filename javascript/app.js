// starting point for the frontend

import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store'

import db from 'db'
import h from 'helpers'

import SiteHeader from 'site-header'
import SiteFooter from 'site-footer'
import HomePage from 'home-page'
import LoginPage from 'login-page'
import ShipmentPage from 'shipment-page'
import StockCardPage from 'stockcard-page'

require('./styles/app.less')

// custom router https://hackernoon.com/routing-in-react-the-uncomplicated-way-b2c5ffaee997
// & https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d

const PAGES = {
  '/': { component: HomePage, params: ['offset'] },
  'login': { component: LoginPage, params: [] },
  'shipment': { component: ShipmentPage, params: ['id'] },
  'stockcard': { component: StockCardPage, params: ['category', 'item'] },
  // '/login': HomePage,
}

class App extends React.Component {
  state = {
    route: parseHash(location.hash)
  }
  componentDidMount = () => {
    window.addEventListener('hashchange', (event) => {
      this.setState({ route: parseHash(location.hash) })
    })
  }
  render() {
    const page = PAGES[this.state.route.path]
    const Handler = page ? page.component : HomePage

    return (
      <div>
        <SiteHeader route={this.state.route} />
        <div className='container'>
          <Handler key={location.hash} route={this.state.route} />
        </div>
        <SiteFooter />
      </div>
    )
  }
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

function parseHash(hash) {
  const route = { dbName: null, currentLocationName: null, path: '/', params: {} }
  if (!hash) return route
  let hashSplit = hash.split('/')
  if (hashSplit[0] === '#d') {
    hashSplit.splice(0, 1)
    route.dbName = hashSplit.splice(0, 1)[0]
    route.currentLocationName = h.capitalize(db.getNamefromDBName(route.dbName))
  } else {
    hashSplit.splice(0, 1)
  }
  route.path = hashSplit.splice(0, 1)[0]
  if (!PAGES[route.path]) {
    hashSplit = [route.path]
    route.path = '/'
  }
  route.params = buildParams(PAGES[route.path].params, hashSplit)
  return route
}

function buildParams(params, paramsArray) {
  const paramsMapped = {}
  params.forEach((paramName, i) => {
    let paramValue = paramsArray[i]
    paramValue = isNaN(Number(paramValue)) ? paramValue : Number(paramValue)
    paramsMapped[paramName] = paramValue
  })
  return paramsMapped
}
