// actions and reducer for viewing items
import client from 'client'

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVED_ITEMS = 'RECEIVED_ITEMS'

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
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_ITEMS: {
      return { ...state, loading: false, firstRequest: false, ...action.response }
    }
    default: {
      return state
    }
  }
}

function parseResponse (body) {
  const headers = ['from', 'item', 'category']
  const items = body.rows.map(row => {
    headers.forEach((header, i) => { row[header] = row.key[i] })
    return row
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

export const stockCardLink = (dbName, transaction, atBatch = false) => {
  const { item, category } = transaction
  let link = `/#d/${dbName}/stockcard/${encodeURIComponent(category)}/${encodeURIComponent(item)}/`
  if (atBatch) {
    let { expiration, lot } = transaction
    expiration = expiration === null ? '' : expiration
    lot = lot === null ? '' : lot
    link += `${expiration}__${lot}/`
  }
  return link
}

export const searchItems = (rows, input) => {
  return rows.filter(item =>
    item.item.toLowerCase().indexOf(input) !== -1 ||
    item.category.toLowerCase().indexOf(input) !== -1
  )
}

export const searchCategories = (rows, input) => {
  return rows.filter(cat => cat.name.toLowerCase().indexOf(input) !== -1)
}

export const displayItemName = (row) => {
  return `${row.item} ${row.category}`
}
