// Redux setup is /containers = use redux & app logic + html, /components = just render html
// Reducers and actions for each section of the store live in the same file,
// e.g. user.js holds actions around user, then reducers for state.user

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import user from 'user'
import shipments from 'shipments'
import reports from 'reports'
import locations from 'locations'
import stock from 'stock'
import items from 'items'
import admin from 'admin'

export default createStore(
  combineReducers({ user, stock, admin, shipments, reports, locations, items }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
)
