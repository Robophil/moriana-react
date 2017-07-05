// starting point for the frontend

import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter as Router, Route, Redirect } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from 'store'

import SiteHeader from 'site-header'
import SiteFooter from 'site-footer'
import HomePage from 'home-page'
import LoginPage from 'login-page'
import ShipmentPage from 'shipment-page'

require('./styles/app.less')

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className='app'>
        <SiteHeader />
        <div className='container'>
          {/* <Route exact path='/' component={HomePage} /> */}
          <Route path='/login' component={LoginPage} />
          <Route exact path='/d/:dbName' component={HomePage} />
          <Route exact path='/d/:dbName/shipment/:id' component={ShipmentPage} />
        </div>
        {/* <Route path='/admin/users' component={AdminPage} /> */}
        <SiteFooter />
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
