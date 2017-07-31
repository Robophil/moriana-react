// actions and reducer for reports
import Moment from 'moment';
import client from 'client'
import { getCategories } from 'items'

export const REQUEST_ALL_TRANSACTIONS = 'REQUEST_ALL_TRANSACTIONS'
export const RECEIVED_ALL_TRANSACTIONS = 'RECEIVED_ALL_TRANSACTIONS'
export const RUN_FILTERED_REPORT = 'RUN_FILTERED_REPORT'

export const TRANSACTIONS_ERROR = 'TRANSACTIONS_ERROR'

export const getReportInfo = (dbName, locationsExcludedFromConsumption = {}) => {
  return dispatch => {
    dispatch({ type: REQUEST_ALL_TRANSACTIONS })
    return new Promise((resolve, reject) => {
      fetchAllShipments(dbName, resolve, reject)
    }).then((shipments) => {
      dispatch({ type: RECEIVED_ALL_TRANSACTIONS, shipments, locationsExcludedFromConsumption })
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

export const runReport = (reportType, filterType, filterIndex) => {
  return dispatch => {
    dispatch({ type: RUN_FILTERED_REPORT, reportType, filterType, filterIndex })
  }
}

const defaultReports = {
  loading: false,
  apiError: null,
  transactions: [],
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

export default (state = defaultReports, action) => {
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

      return {
        ...state,
        loading: false,
        transactions,
        dateFilter,
        categoryFilter,
        batchFilter,
        allCategoryFilters,
        allDateFilters
      }
    }
    case RUN_FILTERED_REPORT: {
      console.log(action.reportType, action.filterType, action.filterIndex)
      let { dateFilter, categoryFilter, batchFilter } = state
      if (action.filterType === 'dates') {
        dateFilter = state.allDateFilters[action.filterIndex]
      } else if (action.filterType === 'categories') {
        categoryFilter = state.allCategoryFilters[action.filterIndex]
      } else if (action.filterType === 'batches') {
        batchFilter = state.allBatchFilters[action.filterIndex]
      }
      return { ...state, dateFilter, categoryFilter, batchFilter }
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

  // dateQuantitySort(transactions) {
  //   return _.sortBy(transactions, (t) => {
  //     return t.date + (-1 * t.quantity);
  //   });
  // },
  //
  // addDateNameToRange(dateRange) {
  //   const name = _.map(dateRange, date => Moment(date).format('LL')).join(' - ');
  //   dateRange.name = name;
  //   return dateRange;
  // },
  //
  // getDateFields() {
  //   return [
  //     { fieldname: 'start-date', label: 'Start Date', classes: 'validate-on-blur text-left', close: true, },
  //     { fieldname: 'end-date', label: 'End Date', classes: 'validate-on-blur text-left', close: true, },
  //   ];
  // },
  //
  // getBatches(transactions) {
  //   const itemsHash = _.reduce(transactions, (memo, t) => {
  //     const key = this.getKey(t);
  //     memo[key] = memo[key] || { item: t.item, expiration: t.expiration, lot: t.lot, category: t.category, transactions: [] };
  //     memo[key].transactions.push(t);
  //     return memo;
  //   }, {});
  //   _.each(itemsHash, this.addLatestUnitPrice, this);
  //   return this.sort(itemsHash);
  // },
  //
  // getItems(rows) {
  //   const items = _.reduce(rows, (memo, item) => {
  //     const key = this.getItemKey(item);
  //     memo[key] = memo[key] || { item: item.item, category: item.category, transactions: [] };
  //     memo[key].transactions = memo[key].transactions.concat(item.transactions);
  //     return memo;
  //   }, {});
  //   return this.sort(items);
  // },
  //
  // sort(items) {
  //   return _.sortBy(items, item => item.item.toLowerCase());
  // },
  //
  // getKey(t) {
  //   return `${t.item}__${t.category}__${t.expiration}__${t.lot}`;
  // },
  //
  // getItemKey(t) {
  //   return `${t.item}__${t.category}`;
  // },
  //
  // consumption(items, filters) {
  //   const {category, startDate, endDate, itemLevel} = this.parseFilters(filters);
  //   let rows = category ? _.filter(items, item => item.category === category) : items;
  //   rows = itemLevel ? this.getItems(rows) : rows;
  //   return this.getConsumptionData(rows, startDate, endDate);
  // },
  //
  // parseFilters(filters) {
  //   return {
  //     category: filters.categories.name === 'All Categories' ? null : filters.categories.name,
  //     startDate: filters.dates.startDate,
  //     endDate: filters.dates.endDate,
  //     itemLevel: filters.batches.itemLevel,
  //   }
  // },
  //
  // quality(items) {
  //   return _.filter(items, item => {
  //     item.qualityTotal = 0;
  //     return _.some(transactionsUtil.dateQuantitySort(item.transactions), t => {
  //       item.qualityTotal += t.quantity;
  //       if (item.qualityTotal < 0) {
  //         item.qualityDate = t.date;
  //         return true;
  //       }
  //     });
  //   });
  // },
  //
  // outOfStock(items) {
  //   const itemsWithoutCategories = _.reduce(items, (memo, item) => {
  //     memo[item.item] = memo[item.item] || { item: item.item, transactions: [], itemCategories: [] };
  //     memo[item.item].itemCategories.push(item.category);
  //     memo[item.item].itemCategories = _.uniq(memo[item.item].itemCategories);
  //     memo[item.item].transactions = memo[item.item].transactions.concat(item.transactions);
  //     return memo;
  //   }, {});
  //   return _.filter(itemsWithoutCategories, item => {
  //     const sortedTransactions = transactionsUtil.dateQuantitySort(item.transactions);
  //     const total = _.reduce(sortedTransactions, (memo, t) => memo += t.quantity, 0);
  //     item.lastDate = _.last(sortedTransactions).date;
  //     return (total === 0);
  //   });
  // },
  //
  // sum(transactions) {
  //   return _.reduce(transactions, (memo, t) => memo += t.quantity, 0);
  // },
  //
  // expired(items, filters) {
  //   return _.reduce(items, (memo, item) => {
  //     _.each(item.transactions, t => {
  //       if (t.to.toLowerCase() == 'expired'
  //         && t.date >= filters.dates.startDate
  //         && t.date < filters.dates.endDate) {
  //         memo.push(t);
  //       }
  //     });
  //     return memo;
  //   }, []);
  // },
  //
  // short(items, months) {
  //   const batches = _.sortBy(_.sortBy(batchesUtil.byPositive(batchesUtil.getBatches(
  //     _.chain(items).pluck('transactions').flatten().value()
  //   )), 'sum').reverse(), 'expiration');
  //   const nextMonthStart = Moment.utc().add(1, 'months').startOf('month');
  //   const startDate = nextMonthStart.toISOString();
  //   const endDate = nextMonthStart.add(months, 'months').toISOString();
  //   const rows = _.reduce(batches, (memo, batch) => {
  //     if (batch.expiration >= startDate && batch.expiration < endDate) {
  //       batch.quantity = batch.sum;
  //       memo.push(batch);
  //     }
  //     return memo;
  //   }, []);
  //   return rows;
  // },
  //
  // addLatestUnitPrice(item) {
  //   const transactionsWithUnitPrice = _.filter(item.transactions, t => t.unitPrice);
  //   const latestTransactionWithUnitPrice = _.last(transactionsWithUnitPrice);
  //   item.latestUnitPrice = latestTransactionWithUnitPrice ? latestTransactionWithUnitPrice.unitPrice : 0;
  // },
  //
  // reportKeys: {
  //   amc: 'AMC',
  //   opening: 'Opening',
  //   received: 'Received',
  //   closing: 'Closing',
  //   consumed: 'Consumed',
  //   expired: 'Expired',
  //   lost: 'Damaged/Lost',
  //   miscount: 'Miscount',
  //   positiveAdjustments: 'Positive Adjustments',
  //   negativeAdjustments: 'Negative Adjustments',
  // },
  //
  // getConsumptionData (items, startDate, endDate) {
  //   _.each(items, item => {
  //     _.each(_.keys(this.reportKeys), key => item[key] = 0);
  //     item.amc = countTransactionsUtil.getAMCByMonths(item.transactions, 6, endDate);
  //     _.each(item.transactions, transaction => {
  //       this.addConsumptionColumns(transaction, item, startDate, endDate);
  //     });
  //   });
  //   return this.filterOutZeros(items);
  // },
  //
  // addConsumptionColumns(t, item, startDate, endDate) {
  //   if (t.date <= endDate) {
  //     item.closing += t.quantity;
  //   }
  //   if (t.date < startDate) {
  //     item.opening += t.quantity;
  //   }
  //   if (t.date > startDate && t.date <= endDate) {
  //     if (t.to == 'Expired') {
  //       item.expired += t.quantity;
  //     }
  //     else if (t.to == 'Lost' || t.to == 'Damaged') {
  //       item.lost += t.quantity;
  //     }
  //     else if (t.to == 'Miscount') {
  //       item.miscount += t.quantity;
  //     }
  //     else if (t.to == 'Miscount') {
  //       item.miscount += t.quantity;
  //     }
  //     else if (t.fromAttributes && t.fromAttributes.excludeFromConsumption) {
  //       item.positiveAdjustments += t.quantity;
  //     }
  //     else if (t.toAttributes && t.toAttributes.excludeFromConsumption) {
  //       item.negativeAdjustments += t.quantity;
  //     }
  //     else if (t.quantity > 0) {
  //       item.received += t.quantity;
  //     } else {
  //       item.consumed += t.quantity;
  //     }
  //   }
  // },
  //
  // filterOutZeros(items) {
  //   const itemLevelsAccountedFor = {};
  //   return _.filter(items, item => {
  //     const key = item.item + item.category;
  //     if (this.isAllZeros(item) && itemLevelsAccountedFor[key]) {
  //       return false;
  //     } else {
  //       itemLevelsAccountedFor[key] = true;
  //       return true;
  //     }
  //   });
  // },
  //
  // isAllZeros(item) {
  //   return _.every(_.keys(this.reportKeys), key => item[key] === 0);
  // },
