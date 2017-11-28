import Moment from 'moment'
import clone from 'clone'

export const shortDatedReport = (itemsByBatch) => {
  const displayRows = []
  const nextMonthStart = Moment.utc().add(1, 'months').startOf('month')
  const startDate = nextMonthStart.toISOString()
  const endDate = nextMonthStart.add(5, 'months').toISOString()
  itemsByBatch.forEach(batch => {
    const row = getBlankRow(batch)
    if (batch.expiration >= startDate && batch.expiration < endDate) {
      row.quantity = 0
      row.totalValue = 0
      batch.transactions.forEach(t => {
        row.quantity += t.quantity
        row.totalValue += t.totalValue
      })
      if (row.quantity > 0) {
        displayRows.push(row)
      }
    }
  })
  sortOnDate(displayRows, 'expiration')
  const displayHeaders = getItemHeaders(true).concat([
    { name: 'Quantity', key: 'quantity'},
    { name: 'Total Value', key: 'totalValue'}
  ])
  return { displayRows, displayHeaders }
}

export const expiredReport = (itemsByBatch, dateFilter) => {
  const displayRows = []
  const {startDate, endDate} = dateFilter || {}
  itemsByBatch.forEach(batch => {
    batch.transactions.forEach(t => {
      if (t.to.toLowerCase() == 'expired' && t.date >= startDate && t.date < endDate) {
        const expiredTransaction = clone(t)
        expiredTransaction.quantity = Math.abs(expiredTransaction.quantity)
        displayRows.push(expiredTransaction)
      }
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

export const outOfStockReport = (items) => {
  const displayRows = []

  const itemsWithoutCategories = items.reduce((memo, itemWithCategory) => {
    const {item, category} = itemWithCategory
    memo[item] = memo[item] || { item, transactions: [], categories: [] }
    memo[item].categories.push(category)
    memo[item].transactions.push(...itemWithCategory.transactions)
    return memo
  }, {})

  Object.keys(itemsWithoutCategories).forEach(key => {
    let quantity = 0
    let date = null
    itemsWithoutCategories[key].transactions.forEach(t => {
      quantity += t.quantity
      // if quantity is less than zero and we have not set `date` yet
      if (quantity <= 0) {
        if (!date) {
          date = t.date
        }
      } else {
        date = null
      }
    })
    if (quantity <= 0) {
      displayRows.push({ categories: itemsWithoutCategories[key].categories, date, item: key })
    }
  })
  sortOnDate(displayRows, 'date')
  displayRows.reverse()
  const displayHeaders = [
    { name: 'Item', key: 'item'},
    { name: 'Categories', key: 'categories'},
    { name: 'Out of Stock Since', key: 'date'}
  ]
  return { displayRows, displayHeaders }
}

export const dataQualityReport = (itemsByBatch) => {
  const displayRows = []
  itemsByBatch.forEach(batch => {
    let quantity = 0
    batch.transactions.forEach(t => { quantity += t.quantity })
    if (quantity < 0) {
      displayRows.push(Object.assign({quantity}, getBlankRow(batch)))
    }
  })
  const displayHeaders = getItemHeaders(true).concat([
    { name: 'Quantity', key: 'quantity'},
  ])
  sortByItemName(displayRows)
  return { displayRows, displayHeaders }
}

const getBlankRow = (batch) => {
  const { item, category, lot, expiration } = batch
  return { item, category, lot, expiration }
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
