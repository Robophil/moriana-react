// actions and reducer for admin
import client from 'client'

export const GET_USERS_REQUEST = 'GET_USERS_REQUEST'
export const GET_USERS_SUCCESS = 'GET_USERS_SUCCESS'

export const getUsers = () => {
  return dispatch => {
    dispatch({ type: GET_USERS_REQUEST })
    return client.get('users')
      .then(usersResponse => {
        return client.get('earlysignup').then(earlysignupResponse => {
          dispatch({
            type: GET_USERS_SUCCESS,
            users: usersResponse.body.users || [],
            earlyUsers: usersResponse.body.earlysignup || []
          })
        })
      })
  }
}

const defaultAdmin = {
  loading: false,
  users: [],
  earlyUsers: [],
  apiError: null
}

export default (state = defaultAdmin, action) => {
  switch (action.type) {
    case GET_USERS_REQUEST: {
      return { ...state, loading: true, apiError: null }
    }
    case GET_USERS_SUCCESS: {
      return {
        ...state,
        users: action.users,
        earlyUsers: action.earlyUsers,
        loading: false
      }
    }
    default: {
      return state
    }
  }
}
