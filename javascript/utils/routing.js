import h from 'helpers'
import db from 'db'

export const parseHash = (hash, PAGES) => {
  const route = { dbName: null, currentLocationName: null, path: '/', params: {} }
  if (!hash) return route
  let hashSplit = hash.split('/')
  if (hashSplit[0] === '#d') {
    hashSplit.splice(0, 1)
    route.dbName = hashSplit.splice(0, 1)[0]
    route.currentLocationName = h.capitalize(db.getNamefromDBName(route.dbName))
  } else {
    hashSplit.splice(0, 1)
  }
  // if our path is /shipment/edit-new/receive and there's a route for it,
  // we want to use that route before /shipment/ or /shipment/edit-new/
  let tempPath
  let paramValues = []
  const dirsLength = hashSplit.length
  for (let i = 0; i < dirsLength; i++) {
    const dir = hashSplit.shift()
    tempPath = tempPath ? tempPath + '/' + dir : dir
    if (dirsLength === 1 && !PAGES[tempPath]) {
      route.path = '/'
      paramValues = [dir]
    } else if (PAGES[tempPath]) {
      route.path = tempPath
      paramValues = hashSplit.map(param => param)
    }
  }
  route.params = buildParams(PAGES[route.path].paramKeys, paramValues)
  return route
}

function buildParams (paramKeys, paramValues) {
  const paramsMapped = {}
  paramKeys.forEach((paramName, i) => {
    let paramValue = paramValues[i]
    if (paramValue === undefined) {
      paramValue = 0
    } else {
      paramValue = isNaN(Number(paramValue)) ? decodeURIComponent(paramValue) : Number(paramValue)
    }
    paramsMapped[paramName] = paramValue
  })
  return paramsMapped
}
