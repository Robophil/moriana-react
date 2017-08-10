// Redux setup is /containers = use redux & app logic + html, /components = just render html
// Reducers and actions for each section of the store live in the same file,
// e.g. user.js holds actions around user, then reducers for state.user

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

const testsContext = require.context('./', false, /.js/)
const modules = testsContext.keys().reduce((memo, filename) => {
  const name = filename.split('./')[1].split('.js')[0]
  if (name !== 'store') memo[name] = testsContext(filename).default
  return memo
}, {})

export default createStore(
  combineReducers(modules),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunkMiddleware)
)
