// actions and reducer for viewing items
import client from 'client'
import clone from 'clone'

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVED_ITEMS = 'RECEIVED_ITEMS'
export const ADD_ITEM = 'ADD_ITEM'

export const getItems = (dbName, currentLocationName) => {
  return dispatch => {
    dispatch({ type: REQUEST_ITEMS })
    const key = [currentLocationName.toLowerCase()]
    const startkey = JSON.stringify([...key, {}])
    const endkey = JSON.stringify([...key])
    return client.getDesignDoc(dbName, 'stock', { reduce: true, startkey: startkey, endkey: endkey, group_level: 3 })
    .then(response => {
      const { body } = response
      dispatch({
        type: RECEIVED_ITEMS,
        response: { ...parseResponse(body) }
      })
    })
  }
}

export const addItem = ({item, category}) => {
  return dispatch => {
    dispatch({ type: ADD_ITEM, item, category })
  }
}

const defaultItems = {
  loading: false,
  items: [],
  apiError: null,
  firstRequest: true,
  categories: []
}

export default (state = defaultItems, action) => {
  switch (action.type) {
    case REQUEST_ITEMS: {
      const newState = clone(state)
      return { ...newState, loading: true, apiError: null }
    }
    case RECEIVED_ITEMS: {
      const newState = clone(state)
      return { ...newState, loading: false, firstRequest: false, ...action.response }
    }
    case ADD_ITEM: {
      const newState = clone(state)
      const {item, category} = action
      if (newState.categories.every(cat => cat.name !== category)) {
        newState.categories.push({ name: category })
      }
      if (newState.items.every(item => item.item !== item && item.category !== category)) {
        newState.items.push({ item, category })
      }
      return { ...newState, loading: false, firstRequest: false, ...action.response }
    }
    default: {
      return state
    }
  }
}

function parseResponse (body) {
  const headers = ['from', 'item', 'category']
  const items = body.rows.map(row => {
    return { item: row.key[1], category: row.key[2], value: row.value}
  }).sort((a, b) => a.item.toLowerCase().localeCompare(b.item.toLowerCase()))
  const categories = getCategories(items)
  return { items, categories }
}

export const getCategories = (items) => {
  return items.reduce((memo, item) => {
    if (memo.indexOf(item.category) === -1) {
      memo.push(item.category)
    }
    return memo
  }, [])
  .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  .map(cat => { return { name: cat } })
}

export const searchItems = (rows, input) => {
  return rows.filter(item =>
    item.item.toLowerCase().indexOf(input) !== -1 ||
    item.category.toLowerCase().indexOf(input) !== -1
  ).sort((a, b) => {
    if (a.item.toLowerCase().indexOf(input) === 0) {
      return -1
    } else if (b.item.toLowerCase().indexOf(input) === 0) {
      return 1
    } else {
      return 0
    }
  })
}

export const searchCategories = (rows, input) => {
  return rows.filter(cat => cat.name.toLowerCase().indexOf(input) !== -1)
}

export const displayItemName = (row) => {
  return `${row.item} ${row.category}`
}
