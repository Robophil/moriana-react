// starting point for the frontend
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store'

import { parseHash } from 'routing'

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
  'stockcard': { component: StockCardPage, params: ['category', 'item', 'atBatch'] }
}

class App extends React.Component {
  state = {
    route: parseHash(location.hash, PAGES),

  }
  componentDidMount = () => {
    window.addEventListener('hashchange', (event) => {
      // reset state on db change
      const newRoute = parseHash(location.hash, PAGES)
      const { dbName } = this.state.route
      if (newRoute.dbName !== dbName && dbName !== null) {
        // reload page instead of clear store; for occassional application updates.
        window.location.reload()
      }
      this.setState({ route: newRoute })
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
