// all server communication functions

import fetch from 'isomorphic-fetch'
import config from 'config'

export default {
  get (resource, params) {
    let url = config.backendUrl + resource
    if (params) url = `${url}?${getParams(params)}`
    return fetch(url, { credentials: 'include' })
    .then(parseJSON)
    .catch(parseError)
  },

  getDesignDoc (dbName, designDocName, options = {}) {
    const searchParams = getParams({
      reduce: false,
      descending: true,
      ...options
    })
    return this.get(`${dbName}/_design/${designDocName}/_view/${designDocName}?${searchParams}`)
  },

  getDoc (dbName, id) {
    return this.get(`${dbName}/${id}`)
  },

  destroy (url) {
    return fetch(config.backendUrl + url, {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' }
    })
    .then(parseJSON)
    .catch(parseError)
  },

  put (url, data = {}) {
    return this.post(url, data, 'PUT')
  },

  post (url, data = {}, method = 'POST') {
    return fetch(config.backendUrl + url, {
      method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(parseJSON)
    .catch(parseError)
  }

}

function parseJSON (httpResponse) {
  return httpResponse.json().then((response) => {
    return {
      status: httpResponse.status,
      statusText: httpResponse.status,
      body: response
    }
  })
}

function parseError (error) {
  return {
    status: 500,
    statusText: error.message,
    body: { error: error.message }
  }
}

function getParams (data) {
  return Object.keys(data).map(key => [key, data[key]].map(encodeURIComponent).join('=')).join('&')
}
