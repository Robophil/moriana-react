// starting point for the frontend
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store'
import { parseHash } from 'routing'
import SiteHeader from 'site-header'
import SiteFooter from 'site-footer'
import ShipmentsPage from 'shipments-page'
import LoginPage from 'login-page'
import ShipmentPage from 'shipment-page'
import StockCardPage from 'stockcard-page'
// import CurrentStockPage from 'current-stock-page'
import ReportsPage from 'reports-page'
import EditShipmentPage from 'edit-shipment-page'
import LocationsPage from 'locations-page'

require('./styles/app.less')

// custom router https://hackernoon.com/routing-in-react-the-uncomplicated-way-b2c5ffaee997
// & https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d

const PAGES = {
  '/': { component: ShipmentsPage, paramKeys: ['offset'] },
  'login': { component: LoginPage, paramKeys: [] },
  'shipment': { component: ShipmentPage, paramKeys: ['id'] },
  'shipment/edit': { component: EditShipmentPage, paramKeys: ['shipmentType', 'id'] },
  'stockcard': { component: StockCardPage, paramKeys: ['category', 'item', 'atBatch'] },
  'reports': { component: ReportsPage, paramKeys: ['reportType'] },
  'locations': { component: LocationsPage, paramKeys: ['location'] }
}

class App extends React.Component {
  state = {
    route: parseHash(window.location.hash, PAGES)
  }
  componentDidMount = () => {
    window.addEventListener('hashchange', (event) => {
      // reset state on db change
      const newRoute = parseHash(window.location.hash, PAGES)
      const { dbName } = this.state.route
      if (newRoute.dbName !== dbName && dbName !== null) {
        // reload page instead of clear store; for occassional application updates.
        window.location.reload()
      }
      this.setState({ route: newRoute })
    })
  }
  render () {
    const pageName = this.state.route.path
    const page = PAGES[pageName]
    const Handler = page ? page.component : ShipmentsPage
    const classes = pageName === 'reports' ? '' : 'container'

    return (
      <div>
        <SiteHeader route={this.state.route} />
        <div className={classes}>
          <Handler key={window.location.hash} route={this.state.route} />
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
