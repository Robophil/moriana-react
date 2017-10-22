import React from 'react'
import { connect } from 'react-redux'
import { getStock } from 'stock'
import QuantityByBatch from 'quantity-by-batch'
import AMCTable from 'amc-table'
import {buildHref} from 'shipment-link'
import StockCardLink from 'stockcard-link'
import h from 'helpers'

const StockCardPage = class extends React.Component {
  state = { showAll: false }

  componentDidMount = () => {
    const { dbName, currentLocationName, params } = this.props.route
    let { category, item, atBatch } = params
    category = decodeURIComponent(category)
    item = decodeURIComponent(item)
    this.props.getStock(dbName, currentLocationName, category, item, atBatch)
  }

  showAllRows = (event) => {
    event.preventDefault()
    this.setState({ showAll: true })
  }

  rowSelected = (event) => {
    if (event.target.nodeName !== 'A') {
      window.location.href = buildHref(event.currentTarget.dataset.id, this.props.route.dbName)
    }
  }

  scrollToTop = (event) => {
    event.preventDefault()
    window.scrollTo(0, 0)
  }

  render () {
    const { totalTransactions, batches, atBatch, amcDetails, item, category, expiration, lot } = this.props
    const { dbName } = this.props.route
    const { showAll } = this.state
    let transactions = this.props.transactions || []
    if (!showAll) transactions = transactions.slice(0, 100)
    return (
      <div className='stockcard-page'>
        {this.props.loading ? (
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
              <AMCTable amcDetails={amcDetails} />
            </div>
            <a href='#' className='pull-right'>Download</a>
            <h5>{totalTransactions} Transaction{h.soronos(totalTransactions)}</h5>
            <table>
              <thead>
                <tr>
                  <th>Relative</th>
                  <th>Shipment Date</th>
                  <th>Expiration</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th className='no-print'>filter</th>
                  <th>Item Lot</th>
                  <th>From</th>
                  <th>To</th>
                  <th>User</th>
                  <th>Quantity</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((row, i) => (
                  <tr key={i} onClick={this.rowSelected} data-id={row.id}>
                    <td>{h.dateFromNow(row.date)}</td>
                    <td>{h.formatDate(row.date)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.expiration(row.expiration)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.currency(row.unitPrice)}</td>
                    <td className={`${atBatch ? 'info' : ''}`}>{h.currency(row.totalValue)}</td>
                    <td className={`action no-print ${atBatch ? 'info' : ''}`}>
                      <StockCardLink
                        dbName={dbName}
                        transaction={row}
                        atBatch={!atBatch}
                        >
                        {atBatch ? 'remove' : 'filter'}
                      </StockCardLink>
                    </td>
                    <td className={`${atBatch ? 'info' : ''}`}>{row.lot}</td>
                    <td className='text-capitalize'>{row.from}</td>
                    <td className='text-capitalize'>{row.to}</td>
                    <td>{row.username}</td>
                    <td>{h.num(row.quantity)}</td>
                    <td>{h.num(row.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-right'>
              Showing {h.num(transactions.length)} of {h.num(totalTransactions)} transaction
              {h.soronos(totalTransactions)}. &nbsp;
              {!showAll && transactions.length === totalTransactions
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
  state => state.stock,
  { getStock }
)(StockCardPage)
