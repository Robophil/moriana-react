import Moment from 'moment'
import clone from 'clone'

export const shortDatedReport = (allItemsMap) => {
  const displayRows = []
  const nextMonthStart = Moment.utc().add(1, 'months').startOf('month')
  const startDate = nextMonthStart.toISOString()
  const endDate = nextMonthStart.add(5, 'months').toISOString()
  Object.keys(allItemsMap).forEach(key => {
    Object.keys(allItemsMap[key]).forEach(batchKey => {
      const row = Object.assign(getItemFromkey(key), getBatchFromKey(batchKey))
      if (row.expiration >= startDate && row.expiration < endDate) {
        row.quantity = 0
        row.totalValue = 0
        allItemsMap[key][batchKey].forEach(t => {
          row.quantity += t.quantity
          row.totalValue += t.totalValue
        })
        if (row.quantity > 0) {
          displayRows.push(row)
        }
      }
    })
  })
  sortOnDate(displayRows, 'expiration')
  const displayHeaders = getItemHeaders(true).concat([
    { name: 'Quantity', key: 'quantity'},
    { name: 'Total Value', key: 'totalValue'}
  ])
  return { displayRows, displayHeaders }
}

export const expiredReport = (allItemsMap, dateFilter) => {
  const displayRows = []
  const {startDate, endDate} = dateFilter || {}
  Object.keys(allItemsMap).forEach(key => {
    Object.keys(allItemsMap[key]).forEach(batchKey => {
      allItemsMap[key][batchKey].forEach(t => {
        if (t.to.toLowerCase() == 'expired' && t.date >= startDate && t.date < endDate) {
          const expiredTransaction = clone(t)
          expiredTransaction.quantity = Math.abs(expiredTransaction.quantity)
          displayRows.push(expiredTransaction)
        }
      })
    })
  })
  const displayHeaders = getItemHeaders(true).concat([
    { name: 'Quantity', key: 'quantity'},
    { name: 'Unit Price', key: 'unitPrice'},
    { name: 'Total Value', key: 'totalValue'}
  ])
  sortByItemName(displayRows)
  return { displayRows, displayHeaders }
}

export const outOfStockReport = (allItemsMap) => {
  const displayRows = []
  const itemsWithoutCategories = justItems(allItemsMap)
  Object.keys(itemsWithoutCategories).forEach(key => {
    let quantity = 0
    let since = null
    itemsWithoutCategories[key].transactions.forEach(t => {
      quantity += t.quantity
      // if quantity is less than zero and we have not set `since` yet
      if (quantity <= 0) {
        if (!since) {
          since = t.date
        }
      } else {
        since = null
      }
    })
    if (quantity <= 0) {
      displayRows.push({ categories: itemsWithoutCategories[key].categories, since, item: key })
    }
  })
  sortOnDate(displayRows, 'since')
  const displayHeaders = [
    { name: 'Item', key: 'item'},
    { name: 'Categories', key: 'categories'},
    { name: 'Out of Stock Since', key: 'since'}
  ]
  return { displayRows, displayHeaders }
}

export const dataQualityReport = (allItemsMap) => {
  const displayRows = []
  Object.keys(allItemsMap).forEach(key => {
    Object.keys(allItemsMap[key]).forEach(batchKey => {
      let quantity = 0
      allItemsMap[key][batchKey].forEach(t => { quantity += t.quantity })
      if (quantity < 0) {
        const row = Object.assign({quantity}, getItemFromkey(key), getBatchFromKey(batchKey))
        displayRows.push(row)
      }
    })
  })
  const displayHeaders = getItemHeaders(true).concat([
    { name: 'Quantity', key: 'quantity'},
  ])
  sortByItemName(displayRows)
  return { displayRows, displayHeaders }
}

// items without categories
const justItems = (allItemsMap) => {
  return Object.keys(allItemsMap).reduce((memo, key) => {
    const {item, category} = getItemFromkey(key)
    memo[item] = memo[item] || { item, transactions: [], categories: [] }
    memo[item].categories.push(category)
    Object.keys(allItemsMap[key]).forEach(batchKey => {
      memo[item].transactions = memo[item].transactions.concat(allItemsMap[key][batchKey])
    })
    return memo
  }, {})
}

export const getItemHeaders = (atBatchLevel) => {
  let headers = [
    { key: 'item', name: 'Item' },
    { key: 'category', name: 'Category' }
  ]
  if (atBatchLevel) {
    headers = headers.concat([
      { key: 'expiration', name: 'Expiration' },
      { key: 'lot', name: 'Lot Num' }
    ])
  }
  return headers
}

export const getItemFromkey = (itemKey) => {
  const itemKeySplit = itemKey.split('__')
  return {
    item: itemKeySplit[0],
    category: itemKeySplit[1]
  }
}

export const getBatchFromKey = (batchKey) => {
  const batchKeySplit = batchKey.split('__')
  const batch = {
    expiration: batchKeySplit[0],
    lot: batchKeySplit[1]
  }
  batch.expiration = batch.expiration === 'null' ? null : batch.expiration
  batch.lot = batch.lot === 'null' ? null : batch.lot
  return batch
}

export const sortByItemName = (rows) => {
  rows.sort(sortOnName)
}

const sortOnName = (a, b) => a.item.toLowerCase().localeCompare(b.item.toLowerCase())

const sortOnDate = (rows, dateKeyName) => {
  rows.sort((a, b) => {
    if (a[dateKeyName] < b[dateKeyName]) {
      return -1
    } else if (a[dateKeyName] > b[dateKeyName]) {
      return 1
    } else {
      return sortOnName(a, b)
    }
  })
}
