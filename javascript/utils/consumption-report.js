import { getItemFromkey, getBatchFromKey, getItemHeaders, sortByItemName } from 'other-reports'
import { getAMCByMonths } from 'amc'

const DISPLAY_HEADERS = [
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

export const consumptionReport = (allItems, atBatchLevel, dateRange, categoryFilter, excludedLocations) => {
  let displayRows = []
  const {startDate, endDate} = dateRange || {}
  const { byItem, byBatch } = allItems
  const itemsOrBatches = atBatchLevel ? byBatch : byItem
  const itemsSet = new Set()
  itemsOrBatches.forEach(itemOrBatch => {
    const row = getBlankRow(itemOrBatch)
    itemsSet.add(row.item)
    itemOrBatch.transactions.forEach(t => addConsumptionData(row, t, startDate, endDate, excludedLocations))
    if (notAllZeros(row)) {
      displayRows.push(row)
      itemsSet.delete(row.item)
    }
  })
  itemsSet.forEach(item => {
    displayRows.push(getBlankRow({item}))
  })
  if (categoryFilter) {
    displayRows = displayRows.filter(row => (row.category === categoryFilter))
  }
  sortByItemName(displayRows)
  return { displayRows, displayHeaders: getItemHeaders(atBatchLevel).concat(DISPLAY_HEADERS) }
}

const getBlankRow = ({ item, category, expiration, lot }) => {
  return DISPLAY_HEADERS.reduce((memo, header) => {
    memo[header.key] = 0
    return memo
  }, {item, category, expiration, lot})
}

export const consumptionReportOld = (allItemsMap, atBatchLevel, dateRange, categoryFilter, excludedLocations) => {
  let displayRows = []
  const {startDate, endDate} = dateRange || {}
  if (!atBatchLevel) {
    Object.keys(allItemsMap).forEach(itemKey => {
      const row = getBlankConsumptionRow(false, itemKey)
      Object.keys(allItemsMap[itemKey]).forEach(batchKey => {
        allItemsMap[itemKey][batchKey].forEach(t => addTransactionsConsumption(row, t, startDate, endDate, excludedLocations))
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
          addTransactionsConsumption(row, t, startDate, endDate, excludedLocations)
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
  return { displayRows, DISPLAY_HEADERS: getItemHeaders(atBatchLevel).concat(DISPLAY_HEADERS) }
}

const getBlankConsumptionRow = (atBatchLevel, itemKey, batchKey) => {
  const row = getItemFromkey(itemKey)
  if (atBatchLevel) Object.assign(row, getBatchFromKey(batchKey))
  return DISPLAY_HEADERS.reduce((memo, header) => {
    memo[header.key] = 0
    return memo
  }, row)
}

const addConsumptionData = (row, t, startDate, endDate, excludedLocations) => {
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
    } else if (excludedLocations[t.from]) {
      row.positiveAdjustments += t.quantity
    } else if (excludedLocations[t.to]) {
      row.negativeAdjustments += t.quantity
    } else if (t.quantity > 0) {
      row.received += t.quantity
    } else {
      row.consumed += t.quantity
    }
  }
}

const notAllZeros = (row) => {
  return !DISPLAY_HEADERS.every(header => (row[header.key] === 0))
}
