// starting point for the frontend
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import store from 'store/store'
import { parseHash } from 'utils/routing'
import SiteHeader from 'containers/site-header'
import ShipmentsPage from 'containers/shipments-page'
import LoginPage from 'containers/login-page'
import ShipmentPage from 'containers/shipment-page'
import PrintShipmentPage from 'containers/print-shipment-page'
import StockCardPage from 'containers/stockcard-page'
import CurrentStockPage from 'containers/current-stock-page'
import ReportsPage from 'containers/reports-page'
import EditShipmentPage from 'containers/edit-shipment-page'
import LocationsPage from 'containers/locations-page'
import UsersPage from 'containers/users-page'
import SiteFooter from 'components/site-footer'

require('./styles/app.less')

// custom router https://hackernoon.com/routing-in-react-the-uncomplicated-way-b2c5ffaee997
// & https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d

const PAGES = {
  '/': { component: ShipmentsPage, paramKeys: ['offset'] },
  'login': { component: LoginPage },
  'shipment': { component: ShipmentPage, paramKeys: ['id', 'print'] },
  'shipment/edit': { component: EditShipmentPage, paramKeys: ['shipmentType', 'id'] },
  'shipment/print': { component: PrintShipmentPage, paramKeys: ['id', 'reversed'] },
  'stockcard': { component: StockCardPage, paramKeys: ['category', 'item', 'atBatch'] },
  'reports': { component: ReportsPage, paramKeys: ['reportView'] },
  'locations': { component: LocationsPage, paramKeys: ['location'] },
  'stock': { component: CurrentStockPage },
  'admin/users': { component: UsersPage }
}

class App extends React.Component {
  state = {
    route: parseHash(window.location.hash, PAGES)
  }

  onHashChange = (event) => {
    const newRoute = parseHash(window.location.hash, PAGES)
    this.setState({ route: newRoute })
  }

  componentDidMount = () => {
    window.addEventListener('hashchange', this.onHashChange)
  }

  componentWillUnmount = () => {
    window.removeEventListener('hashchange', this.onHashChange)
  }

  render () {
    const pageName = this.state.route.path
    const page = PAGES[pageName]
    const Handler = page ? page.component : ShipmentsPage

    return (
      <div>
        <SiteHeader route={this.state.route} />
        <div className={'container'}>
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
