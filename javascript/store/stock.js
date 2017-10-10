import client from 'client'
import amc from 'amc'

export const REQUEST_STOCK = 'REQUEST_STOCK'
export const RECEIVED_STOCK = 'RECEIVED_STOCK'

const getStockRequest = (dbName, currentLocationName, category, item) => {
  const key = [currentLocationName.toLowerCase(), item, category]
  const startkey = JSON.stringify([...key, {}])
  const endkey = JSON.stringify([...key])
  return client.getDesignDoc(dbName, 'stock', { startkey: startkey, endkey: endkey })
}

export const getStock = (dbName, currentLocationName, category, item, filter = null) => {
  return dispatch => {
    dispatch({ type: REQUEST_STOCK, item, category })
    getStockRequest(dbName, currentLocationName, category, item)
    .then(response => {
      dispatch({
        type: RECEIVED_STOCK,
        response: { ...parseResponse(response.body, filter) }
      })
    })
  }
}

export const getStockForEdit = (dbName, currentLocationName, category, item, date) => {
  return dispatch => {
    dispatch({ type: REQUEST_STOCK, item, category })
    getStockRequest(dbName, currentLocationName, category, item)
    .then(response => {
      dispatch({
        type: RECEIVED_STOCK,
        response: { ...parseStockForEdit(response.body, date) }
      })
    })
  }
}

const defaultStock = {
  loading: false,
  apiError: null,
  atBatch: false,
  item: null,
  category: null,
  expiration: null,
  lot: null,
  // unitPrice: null,
  batches: [],
  transactions: [],
  totalTransactions: 0,
  amcDetails: {}
}

export default (state = defaultStock, action) => {
  switch (action.type) {
    case REQUEST_STOCK: {
      return { ...defaultStock, loading: true, apiError: null, item: action.item, category: action.category }
    }
    case RECEIVED_STOCK: {
      return { ...state, loading: false, ...action.response }
    }
    default: {
      return state
    }
  }
}

export function parseResponse (body, filter) {
  const parsedResponse = {}
  let rows = parseRows(body)
  if (filter) {
    parsedResponse.atBatch = true
    const { expiration, lot } = parseBatchFilter(filter)
    parsedResponse.expiration = expiration
    parsedResponse.lot = lot
    rows = batchFilter(rows, expiration, lot)
  }
  parsedResponse.totalTransactions = rows.length
  parsedResponse.batches = getBatches(rows).filter(batch => batch.sum !== 0)
  parsedResponse.amcDetails = amc.getAMCDetails(rows)
  parsedResponse.transactions = addResultingQuantities(rows)
  return parsedResponse
}

function parseRows (response) {
  const headers = ['from', 'item', 'category', 'expiration',
    'lot', 'unitPrice', 'date', '_id', 'from', 'to', 'username']
  return response.rows.map(row => {
    headers.forEach((header, i) => {
      row[header] = row.key[i]
    })
    row.quantity = row.value
    row.totalValue = Math.abs(row.quantity * row.unitPrice)
    return cleanTransaction(row)
  })
}

function parseStockForEdit (response, date) {
  let rows = parseRows(response).filter(t => t.date < date)
  const batches = getBatches(rows).filter(batch => batch.sum !== 0)
  return { batches }
}

function cleanTransaction (transaction) {
  transaction.expiration = !transaction.expiration ? null : transaction.expiration
  transaction.lot = !transaction.lot ? null : transaction.lot
  return transaction
}

function parseBatchFilter (filter) {
  let expiration, lot
  expiration = filter.split('__')[0]
  lot = filter.split('__')[1]
  if (!lot || lot === 'null') lot = null
  if (!expiration || expiration === 'null') expiration = null
  return { expiration, lot }
}

function batchFilter (rows, expiration, lot) {
  return rows.filter(row => row.expiration === expiration && row.lot === lot)
}

export function getBatches (transactions, batchLevel = true, inputBatches = {}) {
  const batchesHash = batchReduce(inputBatches, transactions, batchLevel)
  const batches = Object.keys(batchesHash).map((key) => {
    return Object.assign(makeTransactionFromBatchKey(key), batchesHash[key])
  })
  return sortByFEFO(batches)
}

function batchReduce (inputBatches, transactions, batchLevel = true) {
  transactions.reverse()
  let batches = transactions.reduce((batchCacheMemeo, transaction) => {
    const batchKey = getBatchKey(transaction, batchLevel)
    if (!batchCacheMemeo[batchKey]) {
      batchCacheMemeo[batchKey] = {
        count: 1,
        sum: transaction.quantity,
        unitPrice: transaction.unitPrice
      }
    } else {
      batchCacheMemeo[batchKey].count += 1
      batchCacheMemeo[batchKey].sum += transaction.quantity
      if (transaction.unitPrice) {
        batchCacheMemeo[batchKey].unitPrice = transaction.unitPrice
      }
    }

    return batchCacheMemeo
  }, inputBatches)

  transactions.reverse()
  return batches
}

function sortByFEFO (inputBatches) {
  return inputBatches.sort((a, b) => a.item.toLowerCase() > b.item.toLowerCase())
  .sort((a, b) => a.expiration > b.expiration)
}

function getBatchKey (transaction, batchLevel = true) {
  const keys = ['item', 'category']
  if (batchLevel) {
    keys.push('expiration', 'lot')
  }
  const transactionValuesList = keys.map(key => transaction[key] || null)
  return transactionValuesList.join('__')
}

function makeTransactionFromBatchKey (batchKey) {
  const transaction = {}
  const transactionKeys = ['item', 'category', 'expiration', 'lot']
  batchKey.split('__').forEach((key, i) => {
    transaction[transactionKeys[i]] = key === 'null' ? null : key
  })
  transaction.unitPrice = Number(transaction.unitPrice) || 0
  return transaction
}

function addResultingQuantities (rows) {
  const sum = rows.reduce((sum, t) => {
    sum += t.quantity
    return sum
  }, 0)
  const rowsByDate = rows.sort((a, b) => b.date.localeCompare(a.date))
  return rowsByDate.map((t, i) => {
    t.result = (i === 0) ? sum : rowsByDate[i - 1].result - rowsByDate[i - 1].quantity
    return t
  })
}

export function getItemTotalQuantity (transactions, item, category) {
  // const sum = rows.reduce((sum, t) => {
  //   sum += t.quantity
  //   return sum
  // }, 0)
  // editingTransactions = transactions.filter(t => t.item === item && t.category === category)
  return 0
}

// function getBatchesOnDate (transactions, date) {
//   return getBatches(_.filter(transactions, t => t.date < date))
// }
//

//
// function getCategories (items) {
//   const allCategories = _.pluck(items, 'category')
//   const categories = _.map(_.uniq(allCategories), (category) => {
//     return { category: category }
//   })
//   return categories
// }

// function makeTransactionsFromSOHBatches (batches, desiredTransaction) {
//   if (!batches || batches.length == 0) return [desiredTransaction]
//   const startingTransaction = _.clone(desiredTransaction)
//
//   const transactionsFromSOHBatches = _.reduce(batches, (transactionsFromSOHBatches, batch) => {
//     let leftoverTransaction = transactionsFromSOHBatches[0]
//     let newTransaction = makeTransactionFromBatch(batch)
//
//     if (leftoverTransaction.quantity == 0) {
//       transactionsFromSOHBatches.push(batch)
//       return transactionsFromSOHBatches
//     }
//
//     if (leftoverTransaction.quantity >= batch.sum) {
//       newTransaction.quantity = batch.sum
//       newTransaction.sum = 0
//     } else {
//       newTransaction.quantity = leftoverTransaction.quantity
//       newTransaction.sum = batch.sum - leftoverTransaction.quantity
//     }
//
//     leftoverTransaction.quantity -= newTransaction.quantity
//     transactionsFromSOHBatches.push(newTransaction)
//
//     return transactionsFromSOHBatches
//   }, [startingTransaction])
//
//   // move leftover to last position if it has quantity
//   let leftoverTransaction = transactionsFromSOHBatches.shift()
//   if (leftoverTransaction.quantity > 0) {
//     transactionsFromSOHBatches.push(leftoverTransaction)
//   }
//
//   return transactionsFromSOHBatches
// }

// function makeTransactionFromBatch (batch) {
//   const transaction = _.pick(batch, ['item', 'category', 'expiration', 'lot', 'unitPrice'])
//   return transaction
// }
//
// function byPositiveAndZero (batches) {
//   const positiveBatches = byPositive(batches)
//   const zeroItems = byZero(batches)
//   return positiveBatches.concat(zeroItems)
// }

// function byPositive (batches) {
//   return batches.filter(b => b.sum > 0)
//   // const positiveBatches = _.filter(batches, batch => batch.sum > 0)
//   // return positiveBatches
// }
//
// function byZero (batches) {
//   const byItems = byItems(batches)
//   const zeroBalances = _.filter(byItems, batch => batch.sum == 0)
//   return zeroBalances
// }
//
// function byPositiveQuantity (batches) {
//   const positiveQuantityBatches = _.filter(batches, batch => batch.quantity > 0)
//   return positiveQuantityBatches
// }
//
// function byNegative (batches) {
//   const negativeBatches = _.filter(batches, batch => batch.sum < 0)
//   return negativeBatches
// }
//
// function byItems (batches) {
//   const byItemsHash = _.reduce(batches, (byItemsHash, batch) => {
//     if (!byItemsHash[batch.item + batch.category]) {
//       byItemsHash[batch.item + batch.category] = {
//         item: batch.item,
//         category: batch.category,
//         sum: batch.sum
//       }
//     } else {
//       byItemsHash[batch.item + batch.category].sum += batch.sum
//     }
//     return byItemsHash
//   }, {})
//   const byItems = _.map(byItemsHash, itemHash => itemHash)
//   return byItems
// }
//
// function byItem (batches, item, category) {
//   const filteredOnItem = _.where(batches, { item: item })
//   const filteredOnCategory = _.where(filteredOnItem, { category: category })
//   return filteredOnCategory
// }
//
// function byExpiring (batches, startDate, endDate) {
//   const expiringBatches = _.filter(batches, batch => batch.expiration >= startDate && batch.expiration < endDate)
//   const sortedExpiringBatches = _.sortBy(expiringBatches, 'expiration')
//   const sortedExpiringBatchesByPositive = byPositive(sortedExpiringBatches)
//   return sortedExpiringBatchesByPositive
// }
//
// function getBatchesWithTransferQuantity (batches, quantity) {
//   let remainingQuantity = quantity
//   return _.map(batches, inputBatch => {
//     const batch = _.extend({}, inputBatch)
//     if (remainingQuantity) {
//       if (batch.sum > remainingQuantity) {
//         batch.quantity = remainingQuantity
//         remainingQuantity = 0
//       } else {
//         batch.quantity = batch.sum
//         remainingQuantity -= batch.sum
//       }
//       batch.resultingQuantity = batch.sum - batch.quantity
//     }
//     return batch
//   })
// }
