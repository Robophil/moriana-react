import React from 'react'
import { connect } from 'react-redux'
import { getStock } from 'stock'
import QuantityByBatch from 'quantity-by-batch'
import AMCTable from 'amc-table'
import ShipmentLink from 'shipment-link'
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

  showAllRows = () => {
    this.setState({ showAll: true })
  }

  scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  render () {
    const { currentItem, totalTransactions, batches, atBatch, amcDetails } = this.props
    const { item, category, expiration, lot } = currentItem
    const { dbName } = this.props.route
    const { showAll} = this.state
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
            <hr />
            <div className='row'>
              {atBatch ? (<div className='col-md-5 no-print'>
                <div className='alert alert-info'>
                  Filtering on batch: {h.expiration(expiration)} {lot}
                  <StockCardLink
                    dbName={dbName}
                    className='pull-right'
                    transaction={currentItem}
                    >
                    remove filter
                  </StockCardLink>
                </div>
              </div>) : (
                <QuantityByBatch dbName={dbName} batches={batches} />
              )}
              <AMCTable amcDetails={amcDetails} />
            </div>
            <button className='download-button btn btn-default btn-md pull-right'>Download</button>
            <h5 className='transactions-header'>{totalTransactions} Transaction{h.soronos(totalTransactions)}</h5>
            <table className='table table-striped table-small table-hover table-condensed'>
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
                  <th className='result-quantity'>Result</th>
                </tr>
              </thead>
              <tbody className='transactions'>
                {transactions.map((row, i) => (
                  <tr key={i}>
                    <td>{h.dateFromNow(row.date)}</td>
                    <td>
                      <ShipmentLink id={row._id} dbName={this.props.route.dbName} >
                        {h.formatDate(row.date)}
                      </ShipmentLink>
                    </td>
                    <td className={`${atBatch ? 'alert-info' : ''}`}>{h.expiration(row.expiration)}</td>
                    <td className={`${atBatch ? 'alert-info' : ''}`}>{h.num(row.unitPrice)}</td>
                    <td className={`${atBatch ? 'alert-info' : ''}`}>{h.num(row.totalValue)}</td>
                    <td className={`no-print ${atBatch ? 'alert-info' : ''}`}>
                      <StockCardLink
                        dbName={dbName}
                        transaction={row}
                        atBatch={!atBatch}
                        >
                        {atBatch ? (<span>remove filter</span>) : (<span>filter</span>)}
                      </StockCardLink>
                    </td>
                    <td className={`${atBatch ? 'alert-info' : ''}`}>{row.lot}</td>
                    <td className='text-capitalize'>{row.from}</td>
                    <td className='text-capitalize'>{row.to}</td>
                    <td>{row.username}</td>
                    <td>{h.num(row.quantity)}</td>
                    <td>{h.num(row.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-center show-all'>
              Showing {h.num(transactions.length)} of {h.num(totalTransactions)} transaction
              {h.soronos(totalTransactions)}. &nbsp;
              {!showAll && transactions.length === totalTransactions ? <span /> :
              !showAll ? (<button onClick={this.showAllRows} className='btn btn-default btn-lg'>Show All</button>) : (
                <div className='text-center scroll-to-top'>
                  <button onClick={this.scrollToTop} className='btn btn-default btn-lg'>Scroll To Top</button>
                </div>
              )}
            </div>
            <br /><br /><br /><br />
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
