// actions and reducer for notifications to user
import clone from 'clone'

// show note: clear all notes and only show this one
// add note: add to the list of notifications

export const SHOW_NOTE = 'SHOW_NOTE'
export const ADD_NOTE = 'ADD_NOTE'
export const CLEAR_NOTE = 'CLEAR_NOTE'
export const CLEAR_NOTES = 'CLEAR_NOTES'

const DEFAULT_TIMEOUT = 750

// actions

export const clearNote = (id) => {
  return { type: CLEAR_NOTE, id }
}

export const clearNotes = () => {
  return { type: CLEAR_NOTES }
}

// thunks

export const showNote = (text, clear = true) => {
  return dispatch => {
    const id = new Date().toISOString()
    if (clear) {
      setTimeout(() => {
        dispatch(clearNote(id))
      }, DEFAULT_TIMEOUT)
    }
    dispatch({ type: SHOW_NOTE, id, note: { text, id } })
  }
}

// reducers

const defaultNotifications = {}

export default (state = defaultNotifications, action) => {
  switch (action.type) {
    case SHOW_NOTE: {
      const newState = clone(defaultNotifications)
      newState[action.id] = action.note
      return newState
    }
    case ADD_NOTE: {
      const newState = clone(state)
      newState[action.id] = action.note
      return newState
    }
    case CLEAR_NOTE: {
      const newState = clone(state)
      delete newState[action.id]
      return newState
    }
    case CLEAR_NOTES: {
      return defaultNotifications
    }
    default: {
      return state
    }
  }
}
