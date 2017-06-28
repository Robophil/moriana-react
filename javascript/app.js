// starting point for the frontend

import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from 'store'

import SiteHeader from 'site-header'
import SiteFooter from 'site-footer'
import HomePage from 'home-page'
// import AdminPage from 'admin-page'
import LoginPage from 'login-page'

require('./styles/app.less')

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className='app'>
        <SiteHeader />
        <div className='container'>
          <Route exact path='/' component={HomePage} />
          <Route path='/login' component={LoginPage} />
        </div>
        {/* <Route path='/admin/users' component={AdminPage} /> */}
        <SiteFooter />
      </div>
    </Router>
  </Provider>,
  document.getElementById('app')
)
