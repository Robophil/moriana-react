import React from 'react'
import { connect } from 'react-redux'
import { getStock } from 'stock'
import QuantityByBatch from 'quantity-by-batch'
import AMCTable from 'amc-table'
import ShipmentLink from 'shipment-link'
import h from 'helpers'

const StockCardPage = class extends React.Component {
  state = { item: null, category: null, showAll: false }

  componentDidMount = () => {
    const { dbName, currentLocationName, params } = this.props.route
    let { category, item } = params
    category = decodeURIComponent(category)
    item = decodeURIComponent(item)
    this.setState({ item, category })
    this.props.getStock(dbName, currentLocationName, category, item)
  }

  showAllRows = () => {
    this.setState({ showAll: true })
  }

  scrollToTop = () => {
    window.scrollTo(0, 0)
  }

  render () {
    let rows = this.props.rows || []
    const { totalTransactions, batches } = this.props
    const {item, category, showAll} = this.state
    if (!showAll) rows = rows.slice(0, 100)
    return (
      <div className='stockcard-page'>
        {this.props.loading ? (
          <div className='loader' />
        ) : (
          <div>
            <h5 className='text-capitalize'>
              {item} | {category}
            </h5>
            <hr />
            <div className='row'>
              <QuantityByBatch batches={batches} />
              <AMCTable />
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
                {rows.map((row, i) => (
                  <tr key={i}>
                    <td>{h.dateFromNow(row.date)}</td>
                    <td>
                      <ShipmentLink id={row._id} dbName={this.props.route.dbName} >
                        {h.formatDate(row.date)}
                      </ShipmentLink>
                    </td>
                    <td>{h.expiration(row.expiration)}</td>
                    <td>{h.num(row.unitPrice)}</td>
                    <td>{h.num(row.totalValue)}</td>
                    <td className='no-print'><a href='#d/moriana_central_warehouse/stockcard/TB%20Medication/Pyridoxine%2025mg%201000/2018-10-01T00:00:00.000Z__'>filter</a></td>
                    <td>{row.lot}</td>
                    <td className='text-capitalize'>{row.from}</td>
                    <td className='text-capitalize'>{row.to}</td>
                    <td>{row.username}</td>
                    <td>{h.num(row.quantity)}</td>
                    <td></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='text-center show-all'>
              Showing {h.num(rows.length)} of {h.num(totalTransactions)} transaction
              {h.soronos(totalTransactions)}. &nbsp;
              {!showAll && rows.length === totalTransactions ? <span /> :
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
