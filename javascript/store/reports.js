// actions and reducer for reports
import Moment from 'moment'
import client from 'client'
import { getCategories } from 'items'
import clone from 'clone'

// actions

export const REQUEST_ALL_TRANSACTIONS = 'REQUEST_ALL_TRANSACTIONS'
export const RECEIVED_ALL_TRANSACTIONS = 'RECEIVED_ALL_TRANSACTIONS'
export const RUN_REPORT = 'RUN_REPORT'
export const TRANSACTIONS_ERROR = 'TRANSACTIONS_ERROR'

export const receivedAllAction = (shipments, currentLocationName, excludedLocations) => {
  return { type: RECEIVED_ALL_TRANSACTIONS, shipments, currentLocationName, excludedLocations }
}

export const runReportAction = (currentReport, filterType = null, filterIndex = 0, customDateRange = null) => {
  return { type: RUN_REPORT, currentReport, filterType, filterIndex, customDateRange }
}

// thunkettes

export const getReportInfo = (dbName, currentLocationName, excludedLocations = {}) => {
  return dispatch => {
    dispatch({ type: REQUEST_ALL_TRANSACTIONS })
    return fetchAllShipments(dbName).then(shipments => {
      dispatch(receivedAllAction(shipments, currentLocationName, excludedLocations))
    })
  }
}

export const fetchAllShipments = (dbName) => {
  const promise = new Promise((resolve, reject) => {
    fetchShipmentsRecursively(dbName, resolve, reject)
  })
  return promise
}

const fetchShipmentsRecursively = (dbName, resolve, reject, limit = 1000, skip = 0, shipments = []) => {
  client.getDesignDoc(dbName, 'shipments', { skip, limit, include_docs: true }).then(response => {
    shipments = shipments.concat(response.body.rows.map(ship => ship.doc))
    if (response.body.rows.length !== limit) {
      resolve(shipments)
    } else {
      skip += limit
      fetchShipmentsRecursively(dbName, resolve, reject, limit, skip, shipments)
    }
  })
}

export const runReport = (currentReport, filterType = null, filterIndex = null, customDateRange = null) => {
  return dispatch => {
    dispatch(runReportAction(currentReport, filterType, filterIndex, customDateRange))
  }
}

// reducers

export const defaultReportsState = {
  loading: false,
  allItemsFetched: false,
  apiError: null,
  allItems: [],
  reportRows: [],
  reportHeaders: [],
  dateFilter: {},
  categoryFilter: {},
  batchFilter: {},
  allDateFilters: [],
  allCategoryFilters: [],
  allBatchFilters: [
    { name: 'Filtering at Batch Level', itemLevel: false },
    { name: 'Filtering at Item Level', itemLevel: true }
  ],
  reportTypes: {
    consumption: { name: 'Monthly Consumption', filters: ['dates', 'categories', 'batches'] },
    quality: { name: 'Data Quality' },
    expired: { name: 'Expired', filters: ['dates'] },
    short: { name: 'Short Dated' },
    out: { name: 'Out of Stock' }
  }
}

export default (state = defaultReportsState, action) => {
  switch (action.type) {
    case REQUEST_ALL_TRANSACTIONS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_ALL_TRANSACTIONS: {
      const transactions = getTransactionsFromShipments(action.shipments, action.currentLocationName, action.locationsExcludedFromConsumption)
      const allDateFilters = getDateFilters()

      const categories = getCategories(transactions)
      categories.unshift({ name: 'All Categories' })
      const allCategoryFilters = categories

      const dateFilter = allDateFilters[0]
      const categoryFilter = allCategoryFilters[0]
      const batchFilter = state.allBatchFilters[0]

      const allItems = buildItemsHash(transactions)

      return {
        ...state,
        loading: false,
        allItemsFetched: true,
        allItems,
        dateFilter,
        categoryFilter,
        batchFilter,
        allCategoryFilters,
        allDateFilters
      }
    }
    case RUN_REPORT: {
      const currentReport = action.currentReport || 'consumption'
      const reportBuilders = {
        consumption: buildConsumption,
        quality: buildQuality,
        expired: buildExpired,
        short: buildShortList,
        out: buildOutOfStock
      }
      const reportBuilder = reportBuilders[currentReport]

      let { dateFilter, categoryFilter, batchFilter } = state

      if (action.filterType === 'dates') {
        if (action.customDateRange) {
          dateFilter = action.customDateRange
        } else {
          dateFilter = state.allDateFilters[action.filterIndex]
        }
      } else if (action.filterType === 'categories') {
        categoryFilter = state.allCategoryFilters[action.filterIndex]
      } else if (action.filterType === 'batches') {
        batchFilter = state.allBatchFilters[action.filterIndex]
      }

      let items = state.allItems
      if (categoryFilter.name !== 'All Categories') {
        items = Object.keys(state.allItems).reduce((memo, itemKey) => {
          if (categoryFilter.name === itemKey.split('__')[1]) {
            memo[itemKey] = state.allItems[itemKey]
          }
          return memo
        }, {})
      }

      let { reportRows, reportHeaders } = reportBuilder(items, batchFilter, dateFilter, categoryFilter)

      reportRows = reportRows.sort((a, b) => a.item.toLowerCase().localeCompare(b.item.toLowerCase()))

      return { ...state, currentReport, dateFilter, categoryFilter, batchFilter, reportRows, reportHeaders }
    }
    default: {
      return state
    }
  }
}

const getTransactionsFromShipments = (shipments, currentLocationName, locationsExcludedFromConsumption) => {
  // TODO: extend shipments with locationsExcludedFromConsumption, likely forEach shipment add excluded...?
  // or in reports later check locationsExcludedFromConsumption?
  currentLocationName = currentLocationName.toLowerCase()
  const transactions = []
  shipments.forEach(ship => {
    ship.transactions.map(transaction => {
      const { from, fromType, to, toType, date } = ship
      const t = { from, fromType, to, toType, date }
      Object.assign(t, transaction)
      if (t.from === currentLocationName) t.quantity = (-1 * t.quantity)
      t.expiration = !t.expiration ? null : t.expiration
      t.lot = !t.lot ? null : t.lot
      transactions.push(t)
    })
  })
  return transactions
}

const getDateFilters = () => {
  return [...Array(12).keys()].map(i => {
    const beginningOfMonth = Moment.utc().startOf('month').subtract(i + 1, 'month').startOf('day')
    const startDate = beginningOfMonth.toISOString()
    const endDate = beginningOfMonth.endOf('month').toISOString()
    return { startDate, endDate, name: Moment.utc(startDate).endOf('day').format('MMMM YYYY') }
  })
}

const buildItemsHash = (transactions) => {
  return transactions.reduce((memo, t) => {
    const itemKey = `${t.item}__${t.category}`
    const batchKey = `${t.expiration || null}__${t.lot || null}`
    memo[itemKey] = memo[itemKey] || {}
    memo[itemKey][batchKey] = memo[itemKey][batchKey] || []
    memo[itemKey][batchKey].push(t)
    return memo
  }, {})
}

const getItemHeaders = (itemLevel) => {
  const itemLevelHeaders = [
    { key: 'item', name: 'Item' },
    { key: 'category', name: 'Category' }
  ]
  if (itemLevel) {
    return itemLevelHeaders
  } else {
    return itemLevelHeaders.concat([
      { key: 'expiration', name: 'Expiration' },
      { key: 'lot', name: 'Lot Num' }
    ])
  }
}

const reportHeaders = [
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

const getItemFromkey = (itemKey) => {
  const itemKeySplit = itemKey.split('__')
  return {
    item: itemKeySplit[0],
    category: itemKeySplit[1]
  }
}

const getBatchFromKey = (batchKey) => {
  const batchKeySplit = batchKey.split('__')
  const batch = {
    expiration: batchKeySplit[0],
    lot: batchKeySplit[1]
  }
  batch.expiration = batch.expiration === 'null' ? null : batch.expiration
  batch.lot = batch.lot === 'null' ? null : batch.lot
  return batch
}

const getBlankConsumptionRow = (itemLevel, itemKey, batchKey) => {
  const row = getItemFromkey(itemKey)
  if (!itemLevel) Object.assign(row, getBatchFromKey(batchKey))
  return reportHeaders.reduce((memo, header) => {
    memo[header.key] = 0
    return memo
  }, row)
}

const buildConsumption = (allItems, batchFilter, dateFilter, categoryFilter) => {
  const { itemLevel } = batchFilter
  const reportRows = []
  if (itemLevel) {
    Object.keys(allItems).forEach(itemKey => {
      const row = getBlankConsumptionRow(true, itemKey)
      Object.keys(allItems[itemKey]).forEach(batchKey => {
        allItems[itemKey][batchKey].forEach(t => addTransactionsConsumption(row, t, dateFilter.startDate, dateFilter.endDate))
      })
      reportRows.push(row)
    })
  } else {
    Object.keys(allItems).forEach(itemKey => {
      const itemsBatchKeys = Object.keys(allItems[itemKey])
      let row
      let allBatchesAreZeros = true
      for (let i = 0; i < itemsBatchKeys.length; i++) {
        row = getBlankConsumptionRow(false, itemKey, itemsBatchKeys[i])
        allItems[itemKey][itemsBatchKeys[i]].forEach(t => {
          addTransactionsConsumption(row, t, dateFilter.startDate, dateFilter.endDate)
        })
        if (!allColumnsAreZeros(row)) {
          reportRows.push(row)
          allBatchesAreZeros = false
        }
      }

      if (allBatchesAreZeros) {
        delete row.expiration
        delete row.lot
        reportRows.push(row)
      }
    })
  }
  return { reportRows, reportHeaders: getItemHeaders(itemLevel).concat(reportHeaders) }
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
  reportHeaders.forEach(header => {
    if (row[header.key] !== 0) {
      allZeros = false
    }
  })
  return allZeros
}

const buildQuality = (allItems) => {
  const reportRows = []
  Object.keys(allItems).forEach(key => {
    Object.keys(allItems[key]).forEach(batchKey => {
      let quantity = 0
      allItems[key][batchKey].forEach(t => { quantity += t.quantity })
      if (quantity < 0) {
        const row = Object.assign({quantity}, getItemFromkey(key), getBatchFromKey(batchKey))
        reportRows.push(row)
      }
    })
  })
  const reportHeaders = getItemHeaders(false).concat([
    { name: 'Quantity', key: 'quantity'},
  ])
  return { reportRows, reportHeaders }
}

const buildExpired = (allItems, batchFilter, dateFilter) => {
  const reportRows = []
  const {startDate, endDate} = dateFilter
  Object.keys(allItems).forEach(key => {
    Object.keys(allItems[key]).forEach(batchKey => {
      allItems[key][batchKey].forEach(t => {
        if (t.to.toLowerCase() == 'expired' && t.date >= startDate && t.date < endDate) {
          const expiredTransaction = clone(t)
          expiredTransaction.quantity = Math.abs(expiredTransaction.quantity)
          reportRows.push(expiredTransaction)
        }
      })
    })
  })
  const reportHeaders = getItemHeaders(false).concat([
    { name: 'Quantity', key: 'quantity'},
    { name: 'Unit Price', key: 'unitPrice'},
    { name: 'Total Value', key: 'totalValue'}
  ])
  return { reportRows, reportHeaders }
}

const buildShortList = (allItems) => {
  return { reportRows: [], reportHeaders: [] }
}

const buildOutOfStock = (allItems) => {
  return { reportRows: [], reportHeaders: [] }
}
