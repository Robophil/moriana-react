// actions and reducer for user
import config from 'config'
import client from 'utils/client'
import h from 'utils/helpers'
import db from 'utils/db'
import {clone} from 'utils/utils'

export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVED_USER = 'RECEIVED_USER'
export const USER_NOT_FOUND = 'USER_NOT_FOUND'
export const UPDATE_USER = 'UPDATE_USER'
export const UPDATED_USER = 'UPDATED_USER'
export const API_ERROR = 'API_ERROR'

export const RECEIVED_USERS = 'RECEIVED_USERS'
export const SUCCESS_LOGIN = 'SUCCESS_LOGIN'
export const FAILURE_LOGIN = 'FAILURE_LOGIN'

export const getUser = () => {
  return dispatch => {
    return client.get('_session')
      .then(response => {
        const {userCtx} = response.body
        if (userCtx.name) {
          dispatch({ type: RECEIVED_USER, userCtx })
        } else {
          dispatch({ type: USER_NOT_FOUND })
        }
      })
  }
}

export const getUsers = () => {
  return dispatch => {
    dispatch({ type: REQUEST_USER })
    return Promise.all([
      client.get('_all_dbs'),
      client.get('_users/_all_docs', { include_docs: true })
    ])
    .then(response => {
      dispatch({ type: RECEIVED_USERS, users: parseUsersWithDatabases(response) })
    })
  }
}

export const changeRole = (user, role) => {
  return dispatch => {
    dispatch({ type: UPDATE_USER })
    const changedUser = withRoleChange(user, role)
    client.put(`_users/${changedUser.doc._id}`, changedUser.doc)
    .then(response => {
      if (response.status < 300) {
        changedUser.doc._rev = response.body.rev
        dispatch({ type: UPDATED_USER, user: changedUser })
      } else {
        dispatch({ type: API_ERROR, error: response.body })
      }
    })
  }
}

export const login = (name, password) => {
  return (dispatch) => {
    if (h.isEmpty(name) || h.isEmpty(password)) return
    dispatch({ type: REQUEST_USER })
    return client.post('_session', { name, password })
      .then(response => {
        if (response.status >= 400) {
          dispatch({ type: FAILURE_LOGIN })
        } else {
          dispatch({ type: SUCCESS_LOGIN, response: response.body, name })
        }
      })
  }
}

export const logout = () => {
  return dispatch => {
    return client.destroy('_session')
      .then(response => {
        window.location.reload()
      })
  }
}

const defaultAuth = {
  loading: false,
  apiError: null,
  authenticated: false,
  authError: false,
  name: null,
  roles: [],
  prettyRoles: [],
  isAdmin: false,
  getUserFailed: false,
  dbName: null,
  updatingUser: false,
  users: []
}

export default (state = defaultAuth, action) => {
  switch (action.type) {
    case REQUEST_USER: {
      return { ...defaultAuth, apiError: null, loading: true }
    }
    case RECEIVED_USER: {
      return { ...state, ...parseUser(action.userCtx), apiError: null, loading: false, authenticated: true }
    }
    case USER_NOT_FOUND: {
      return { ...defaultAuth, loading: false, apiError: null, getUserFailed: true }
    }
    case UPDATE_USER: {
      const newState = clone(state)
      return { ...newState, apiError: null, updatingUser: true }
    }
    case UPDATED_USER: {
      const newState = clone(state)
      const { user } = action
      const indexOfUser = newState.users.findIndex(u => u.doc._id === user.doc._id)
      newState.users[indexOfUser] = user
      return { ...newState, apiError: null, updatingUser: false }
    }
    case API_ERROR: {
      const newState = clone(state)
      return { ...newState, apiError: action.error, updatingUser: false, loading: false  }
    }
    case RECEIVED_USERS: {
      return { ...state, loading: false, users: action.users }
    }
    case SUCCESS_LOGIN: {
      return { ...state, ...parseUser(action.response, action.name), authenticated: true, loading: false, authError: false }
    }
    case FAILURE_LOGIN: {
      return { ...state, authenticated: false, loading: false, authError: true }
    }
    default: {
      return state
    }
  }
}

const parseUser = (response, name) => {
  // couch returns name: null on post to _session if user is admin :(
  name = response.name || name
  return {
    ...response,
    name,
    isAdmin: response.roles.indexOf('_admin') !== -1,
    prettyRoles: parseRoles(response.roles)
  }
}

export const parseRoles = (roles) => {
  return roles.sort().map(role => {
    return { name: db.getNamefromDBName(role, config.deploymentName), dbName: role, type: 'I' }
  })
}

const parseUsersWithDatabases = (response) => {
  const databases = response[0].body
  const userRows = response[1].body.rows
  return userRows.filter(row => (row.id.indexOf('org.couchdb.user:') === 0))
  .map(row => {
    return {
      name: row.doc.name,
      databases: mapRoles(databases, row.doc.roles),
      doc: row.doc
    }
  })
  .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
}

const mapRoles = (databases, roles) => {
  // all location databases are prefixed with the department keyword,
  // e.g. pharmacy_central_warehouse
  return databases.reduce((memo, db) => {
    const nameSplit = db.split('_')
    if (nameSplit[0] !== '' && nameSplit.length >= 2) {
      memo.push({
        name: nameSplit.slice(1).join(' '),
        dbName: db,
        hasAccess: (roles.indexOf(db) !== -1)
      })
    }
    return memo
  }, [])
}

export const withRoleChange = (inputUser, role) => {
  const user = clone(inputUser)
  const roleIndex = user.doc.roles.indexOf(role)
  if (roleIndex === -1) {
    user.doc.roles.push(role)
  } else {
    user.doc.roles.splice(roleIndex, 1)
  }

  user.databases = user.databases.map(database => {
    if (database.dbName === role) {
      database.hasAccess = (roleIndex === -1)
    }
    return database
  })

  return user
}
