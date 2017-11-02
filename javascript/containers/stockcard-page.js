import React from 'react'
import { connect } from 'react-redux'
import { getStock } from 'stock'
import { getLocations } from 'locations'
import QuantityByBatch from 'quantity-by-batch'
import AMCTable from 'amc-table'
import {buildHref} from 'shipment-link'
import StockCardLink from 'stockcard-link'
import h from 'helpers'
import download from 'download'

const VISIBLE_TRANSACTIONS_LIMIT = 100

const StockCardPage = class extends React.Component {
  state = { showAll: false, amcResourcesLoading: true }

  componentDidMount = () => {
    console.log('componentDidMount')
    const { dbName, currentLocationName, params } = this.props.route
    let { category, item, atBatch } = params
    category = decodeURIComponent(category)
    item = decodeURIComponent(item)
    this.props.getStock(dbName, currentLocationName, category, item, atBatch)
    this.props.getLocations(dbName, currentLocationName)
  }

  componentWillReceiveProps = (newProps) => {
    if (!newProps.stock.loading && !newProps.locations.loading) {
      this.setState({ amcResourcesLoading: false })
    }
  }

  showAllRows = (event) => {
    event.preventDefault()
    this.setState({ showAll: true })
  }

  rowSelected = (event) => {
    if (event.target.nodeName !== 'A') {
      const {id} = event.currentTarget.dataset
      window.location.href = buildHref(id, this.props.route.dbName)
    }
  }

  scrollToTop = (event) => {
    event.preventDefault()
    window.scrollTo(0, 0)
  }

  downloadStock = (event) => {
    event.preventDefault()
    const { item, category, transactions } = this.props.stock
    const fileName = item + ' ' + category
    const headers = [
      { name: 'Shipment Date', key: 'date' },
      { name: 'Expiration', key: 'expiration' },
      { name: 'Item Lot', key: 'lot' },
      { name: 'Unit Price', key: 'unitPrice' },
      { name: 'Total Value', key: 'totalValue' },
      { name: 'User', key: 'username' },
      { name: 'From', key: 'from' },
      { name: 'To', key: 'to' },
      { name: 'Quantity', key: 'quantity' },
      { name: 'Result', key: 'result' }
    ]
    download(transactions, headers, fileName)
  }

  render () {
    const {
      transactions,
      totalTransactions,
      batches,
      atBatch,
      item,
      amcDetails,
      category,
      expiration,
      lot,
      loading
    } = this.props.stock
    const {locations} = this.props.locations
    const { dbName } = this.props.route
    const { showAll, amcResourcesLoading } = this.state
    let visibleTransactions = showAll ? transactions : transactions.slice(0, VISIBLE_TRANSACTIONS_LIMIT)
    return (
      <div className='stockcard-page'>
        {loading ? (
          <div className='loader' />
        ) : (
          <div>
            <h5 className='text-capitalize'>
              {item} | {category} {h.expiration(expiration)} {lot}
            </h5>
            <div className='row'>
              {atBatch ? (
                <div className='no-print four columns'>
                  <div className='info filtering-on-batch'>
                    Filtering on batch: {h.expiration(expiration)} {lot} &nbsp;
                    <StockCardLink
                      dbName={dbName}
                      // className='pull-right'
                      transaction={{ item, category, expiration, lot }}
                      >
                      remove
                    </StockCardLink>
                  </div>
                </div>
              ) : (
                <QuantityByBatch dbName={dbName} batches={batches} />
              )}
              {!amcResourcesLoading && (<AMCTable locations={locations} transactions={transactions} />)}
            </div>
            <a href='#' onClick={this.downloadStock} className='pull-right'>Download</a>
            <h5>{totalTransactions} Transaction{h.soronos(totalTransactions)}</h5>
            <table>
              <thead>
                <tr>
                  <th>Relative</th>
                  <th>Shipment Date</th>
                  <th>Expiration</th>
                  <th>Item Lot</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th className='no-print'>filter</th>
                  <th>User</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Quantity</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.map((row, i) => (
                  <tr key={i} onClick={this.rowSelected} data-id={row.id}>
                    <td>{h.dateFromNow(row.date)}</td>
                    <td>{h.formatDate(row.date)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.expiration(row.expiration)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{row.lot}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.currency(row.unitPrice)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.currency(row.totalValue)}</td>
                    <td>{row.username}</td>
                    <td className={`action no-print ${atBatch ? 'info' : ''}`}>
                      <StockCardLink
                        dbName={dbName}
                        transaction={row}
                        atBatch={!atBatch}
                        >
                        {atBatch ? 'remove' : 'filter'}
                      </StockCardLink>
                    </td>
                    <td className='text-capitalize'>{row.from}</td>
                    <td className='text-capitalize'>{row.to}</td>
                    <td>{h.num(row.quantity)}</td>
                    <td>{h.num(row.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-right'>
              Showing {h.num(visibleTransactions.length)} of {h.num(totalTransactions)} transaction
              {h.soronos(totalTransactions)}. &nbsp;
              {!showAll && visibleTransactions.length === totalTransactions
              ? (<span />)
              : !showAll ? (<a href='#' onClick={this.showAllRows}>Show All Transactions</a>) : (
                <a href='#' onClick={this.scrollToTop}>Scroll To Top</a>
              )}
            </div>
            <div className='footer-link'>
              <a href={`/#d/${dbName}/stock/`}>Go to all items</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      stock: state.stock,
      locations: state.locations
    }
  },
  { getStock, getLocations }
)(StockCardPage)
