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
  route.path = hashSplit.splice(0, 1)[0]
  if (!PAGES[route.path]) {
    hashSplit = [route.path]
    route.path = '/'
  }
  route.params = buildParams(PAGES[route.path].params, hashSplit)
  return route
}

function buildParams(params, paramsArray) {
  const paramsMapped = {}
  params.forEach((paramName, i) => {
    let paramValue = paramsArray[i]
    paramValue = isNaN(Number(paramValue)) ? paramValue : Number(paramValue)
    paramsMapped[paramName] = paramValue
  })
  return paramsMapped
}
