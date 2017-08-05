// actions and reducer for reports
import Moment from 'moment';
import client from 'client'
import { getCategories } from 'items'

// actions

export const REQUEST_ALL_TRANSACTIONS = 'REQUEST_ALL_TRANSACTIONS'
export const RECEIVED_ALL_TRANSACTIONS = 'RECEIVED_ALL_TRANSACTIONS'
export const RUN_FILTERED_REPORT = 'RUN_FILTERED_REPORT'
export const TRANSACTIONS_ERROR = 'TRANSACTIONS_ERROR'

export const receivedAllAction = (shipments, excludedLocations) => {
  return { type: RECEIVED_ALL_TRANSACTIONS, shipments, excludedLocations }
}

export const runReportAction = (reportType, filterType = null, filterIndex = 0) => {
  return { type: RUN_FILTERED_REPORT, reportType, filterType, filterIndex }
}

// thunkettes

export const getReportInfo = (dbName, excludedLocations = {}) => {
  return dispatch => {
    dispatch({ type: REQUEST_ALL_TRANSACTIONS })
    return new Promise((resolve, reject) => {
      fetchAllShipments(dbName, resolve, reject)
    }).then((shipments) => {
      dispatch(receivedAllAction(shipments, excludedLocations))
    })
  }
}

const fetchAllShipments = (dbName, resolve, reject, limit = 1000, skip = 0, shipments = []) => {
  client.getDesignDoc(dbName, 'shipments', { skip, limit, include_docs: true }).then(response => {
    shipments = shipments.concat(response.body.rows.map(ship => ship.doc))
    if (response.body.rows.length !== limit) {
      resolve(shipments)
    } else {
      skip += limit
      fetchAllShipments(dbName, resolve, reject, limit, skip, shipments)
    }
  })
}

export const runReport = (reportType, filterType = null, filterIndex = null) => {
  return dispatch => {
    dispatch(runReportAction(reportType, filterType, filterIndex))
  }
}

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
    { name: 'Filtering at Item Level', itemLevel: true },
  ],
  reportTypes: {
    consumption: { name: 'Monthly Consumption', filters: ['dates', 'categories', 'batches'] },
    quality: { name: 'Data Quality', },
    expired: { name: 'Expired', filters: ['dates'], },
    short: { name: 'Short Dated', },
    out: { name: 'Out of Stock', },
  },
}

export default (state = defaultReportsState, action) => {
  switch (action.type) {
    case REQUEST_ALL_TRANSACTIONS: {
      return { ...state, loading: true, apiError: null }
    }
    case RECEIVED_ALL_TRANSACTIONS: {
      const transactions = getTransactionsFromShipments(action.shipments, action.locationsExcludedFromConsumption)
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
    case RUN_FILTERED_REPORT: {
      const {reportType} = action
      const reportBuilders = {
        consumption: buildConsumption,
        quality: buildQuality,
        expired: buildExpired,
        short: buildShortList,
        out: buildOutOfStock,
      }
      const reportBuilder = reportBuilders[reportType]

      let { dateFilter, categoryFilter, batchFilter } = state

      if (action.filterType === 'dates') {
        dateFilter = state.allDateFilters[action.filterIndex]
      } else if (action.filterType === 'categories') {
        categoryFilter = state.allCategoryFilters[action.filterIndex]
      } else if (action.filterType === 'batches') {
        batchFilter = state.allBatchFilters[action.filterIndex]
      }

      const { reportRows, reportHeaders } = reportBuilder(state.allItems, batchFilter, dateFilter, categoryFilter)

      return { ...state, reportType, dateFilter, categoryFilter, batchFilter, reportRows, reportHeaders }
    }
    default: {
      return state
    }
  }
}

const getTransactionsFromShipments = (shipments, locationsExcludedFromConsumption) => {
  // extend shipments with locationsExcludedFromConsumption, likely forEach shipment add excluded...?
  // or in reports later check locsExclConsum
  const transactions = []
  shipments.forEach(ship => {
    delete ship.totalValue
    ship.transactions.map(t => {
      Object.assign(t, ship)
      t.quantity = Math.abs(t.quantity)
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
    { key: 'category', name: 'Category' },
  ]
  if (itemLevel) {
    return itemLevelHeaders
  } else {
    return itemLevelHeaders.concat([
      { key: 'expiration', name: 'Expiration' },
      { key: 'lot', name: 'Lot Num' },
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
  { key: 'negativeAdjustments', name: 'Negative Adjustments' },
]

const buildBlankConsumptionRow = () => {
  return reportHeaders.reduce((memo, header) => {
    memo[header.key] = 0
    return memo
  }, {})
}

const buildConsumption = (allItems, batchFilter, dateFilter, categoryFilter) => {
  const reportRows = []
  const {itemLevel} = batchFilter
  Object.keys(allItems).forEach(itemKey => {
    const itemRow = buildBlankConsumptionRow()
    Object.keys(allItems[itemKey]).forEach(batchKey => {
      let batchRow = batchFilter.itemLevel ? itemRow : buildBlankConsumptionRow()
      allItems[itemKey][batchKey].forEach(t => addConsumptionColumns(batchRow, t, dateFilter.startDate, dateFilter.endDate))
      if (!itemLevel) {
        reportRows.push(batchRow)
      }
    }, [])
    if (itemLevel) {
      reportRows.push(itemRow)
    }
  })
  return { reportRows, reportHeaders: getItemHeaders(itemLevel).concat(reportHeaders) }
}

const addConsumptionColumns = (row, t, startDate, endDate) => {
  ['item', 'category', 'expiration', 'lot'].forEach(key => row[key] = t[key])
  if (t.date <= endDate) {
    row.closing += t.quantity
  }
  if (t.date < startDate) {
    row.opening += t.quantity
  }
  if (t.date > startDate && t.date <= endDate) {
    if (t.to == 'Expired') {
      row.expired += t.quantity
    }
    else if (t.to == 'Lost' || t.to == 'Damaged') {
      row.lost += t.quantity
    }
    else if (t.to == 'Miscount') {
      row.miscount += t.quantity
    }
    else if (t.to == 'Miscount') {
      row.miscount += t.quantity
    }
    else if (t.fromAttributes && t.fromAttributes.excludeFromConsumption) {
      row.positiveAdjustments += t.quantity
    }
    else if (t.toAttributes && t.toAttributes.excludeFromConsumption) {
      row.negativeAdjustments += t.quantity
    }
    else if (t.quantity > 0) {
      row.received += t.quantity
    } else {
      row.consumed += t.quantity
    }
  }
}

const buildQuality = (allItems) => {

}

const buildExpired = (allItems) => {

}

const buildShortList = (allItems) => {

}

const buildOutOfStock = (allItems) => {

}
