import { getItemFromkey, getBatchFromKey, sortByItemName, getItemHeaders } from 'other-reports'

const displayHeaders = [
  { key: 'amc', name: 'AMC' },
  { key: 'opening', name: 'Opening' },
  { key: 'received', name: 'Received' },
  { key: 'closing', name: 'Closing' },
  { key: 'consumed', name: 'Consumed' },
  { key: 'expired', name: 'Expired' },
  { key: 'lost', name: 'Damaged/Lost' },
  { key: 'miscount', name: 'Miscount' },
  { key: 'positiveAdjustments', name: 'Positive Adjustments' },
  { key: 'negativeAdjustments', name: 'Negative Adjustments' }
]
// allItemsMap, atBatchLevel, startDate, endDate, categoryFilter
export const consumptionReport = (allItemsMap, atBatchLevel, dateRange, categoryFilter) => {
  let displayRows = []
  const {startDate, endDate} = dateRange || {}
  if (!atBatchLevel) {
    Object.keys(allItemsMap).forEach(itemKey => {
      const row = getBlankConsumptionRow(false, itemKey)
      Object.keys(allItemsMap[itemKey]).forEach(batchKey => {
        allItemsMap[itemKey][batchKey].forEach(t => addTransactionsConsumption(row, t, startDate, endDate))
      })
      displayRows.push(row)
    })
  } else {
    Object.keys(allItemsMap).forEach(itemKey => {
      const itemsBatchKeys = Object.keys(allItemsMap[itemKey])
      let row
      let allBatchesAreZeros = true
      for (let i = 0; i < itemsBatchKeys.length; i++) {
        row = getBlankConsumptionRow(true, itemKey, itemsBatchKeys[i])
        allItemsMap[itemKey][itemsBatchKeys[i]].forEach(t => {
          addTransactionsConsumption(row, t, startDate, endDate)
        })
        if (!allColumnsAreZeros(row)) {
          displayRows.push(row)
          allBatchesAreZeros = false
        }
      }
      if (allBatchesAreZeros) {
        delete row.expiration
        delete row.lot
        displayRows.push(row)
      }
    })
  }
  sortByItemName(displayRows)
  if (categoryFilter) {
    displayRows = displayRows.filter(row => (row.category === categoryFilter))
  }
  return { displayRows, displayHeaders: getItemHeaders(atBatchLevel).concat(displayHeaders) }
}

const getBlankConsumptionRow = (atBatchLevel, itemKey, batchKey) => {
  const row = getItemFromkey(itemKey)
  if (atBatchLevel) Object.assign(row, getBatchFromKey(batchKey))
  return displayHeaders.reduce((memo, header) => {
    memo[header.key] = 0
    return memo
  }, row)
}

const addTransactionsConsumption = (row, t, startDate, endDate) => {
  if (t.date <= endDate) {
    row.closing += t.quantity
  }
  if (t.date < startDate) {
    row.opening += t.quantity
  }
  if (t.date > startDate && t.date <= endDate) {
    if (t.to === 'Expired') {
      row.expired += t.quantity
    } else if (t.to === 'Lost' || t.to === 'Damaged') {
      row.lost += t.quantity
    } else if (t.to === 'Miscount') {
      row.miscount += t.quantity
    } else if (t.to === 'Miscount') {
      row.miscount += t.quantity
    } else if (t.fromAttributes && t.fromAttributes.excludeFromConsumption) {
      row.positiveAdjustments += t.quantity
    } else if (t.toAttributes && t.toAttributes.excludeFromConsumption) {
      row.negativeAdjustments += t.quantity
    } else if (t.quantity > 0) {
      row.received += t.quantity
    } else {
      row.consumed += t.quantity
    }
  }
}

const allColumnsAreZeros = (row) => {
  let allZeros = true
  displayHeaders.forEach(header => {
    if (row[header.key] !== 0) {
      allZeros = false
    }
  })
  return allZeros
}
