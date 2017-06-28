// actions and reducer for auth
import client from 'client'
import h from 'helpers'

export const REQUEST_USER = 'REQUEST_USER'
export const RECEIVED_USER = 'RECEIVED_USER'
export const FAILED_USER = 'FAILED_USER'
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
          dispatch({ type: FAILED_USER })
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
          dispatch({ type: SUCCESS_LOGIN, response: response.body })
        }
      })
  }
}

export const logout = () => {
  return dispatch => {
    return client.post('logout')
      .then(response => {
        window.location = '/login'
      })
  }
}

const defaultAuth = {
  loading: false,
  apiError: false,
  authenticated: false,
  authError: false,
  name: null,
  roles: [],
  getUserFailed: false
}

export default (state = defaultAuth, action) => {
  switch (action.type) {
    case REQUEST_USER: {
      return { ...defaultAuth, loading: true }
    }
    case RECEIVED_USER: {
      return { ...state, ...userCtx, authenticated: true }
    }
    case FAILED_USER: {
      return { ...defaultAuth, getUserFailed: true }
    }
    case SUCCESS_LOGIN: {
      return { ...state, ...action.response, authenticated: true, loading: false, authError: false }
    }
    case FAILURE_LOGIN: {
      return { ...state, authenticated: false, loading: false, authError: true }
    }
    default: {
      return state
    }
  }
}
