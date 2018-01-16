#!/usr/bin/env node
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const path = require('path')
const fs = require('fs')
const args = require('minimist')(process.argv.slice(2))
const fetch = require('isomorphic-fetch')
const credentials = require('./deployment_credentials')[args.env || 'dev']
console.log(credentials)
const config = require('./deployment_configs')[args.env || 'dev']

const BUILT_JS_PATH = path.resolve(__dirname, './../dist/app.js')
const INDEX_HTML_PATH = path.resolve(__dirname, './../index.html')

const indexFile = makeIndexFile()
const designDocUrl = `${credentials.url}${config.appDatabase}/_design/${config.appDesignDoc}`

login().then(cookie => {
  get(designDocUrl).then(response => {
    const { _rev } = response.body
    const data = {
      _attachments: { 'index.html': { content_type: 'text\/html', data: indexFile } }
    }
    if (_rev) data._rev = _rev
    return put(designDocUrl, data, cookie)
  }).then(response => {
    console.log(response)
  })
})

function put (url, data, cookie) {
  return fetch(url, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'cookie': cookie
    },
    body: JSON.stringify(data)
  })
  .then(parseJSON)
  .catch(parseError)
}

function get (url, params) {
  return fetch(url, { credentials: 'include', body: params })
  .then(parseJSON)
  .catch(parseError)
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

function makeIndexFile() {
  const jsFile = fs.readFileSync(BUILT_JS_PATH, 'utf8')
  // String.repace has weird special replacement patterns that modify the string.
  // So, using a function instead
  const rawIndexFile = fs.readFileSync(INDEX_HTML_PATH, 'utf8')
    .replace(/<script src="app.js"><\/script>/, () => { return '<script>' + jsFile + '<\/script>'})
  return new Buffer(rawIndexFile).toString('base64')
}

function login () {
  return fetch(`${credentials.url}_session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: credentials.username, password: credentials.password })
  })
  .then(response => {
    if (response.status !== 200) {
      console.error(response, 'terminating on wrong credentials')
      process.exit()
    } else {
      return response.headers._headers['set-cookie'][0]
    }
  })
  .catch(response => {
    console.error(response, 'terminating on wrong credentials')
    process.exit()
  })
}
