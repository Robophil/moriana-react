import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import h from 'helpers'
import ShipmentLink from 'shipment-link'
import StockcardLink from 'stockcard-link'

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const { id } = params
    this.props.getShipment(dbName, id)
  }

  render () {
    const ship = this.props.currentShipment || { transactions: [] }
    const { dbName } = this.props.route
    return (
      <div className='shipment-page'>
        {this.props.loading ? (
          <div className='loader' />
        ) : (
          <div>
            <h5 className='text-capitalize'>
              <i className='icon mail-solid' />{ship.prettyType}: {ship.from} to {ship.to}
            </h5>
            <hr />
            <div className='shipment-details'>
              <strong>{h.formatDate(ship.date)}</strong> ({h.dateFromNow(ship.date)})
              <strong> {ship.totalTransactions}</strong> transactions
              total value <strong>{h.currency(ship.totalValue)} </strong>

               | created by <strong>{ship.username} </strong>
                latest edited <strong>{h.dateFromNow(ship.updated)} </strong>
                | <ShipmentLink type='edit' id={ship._id} dbName={dbName} > edit </ShipmentLink>
                | <ShipmentLink type='print' id={ship._id} dbName={dbName} > print </ShipmentLink>
                | <ShipmentLink type='print' id={`${ship._id}/reversed`} dbName={dbName} > print reversed </ShipmentLink>
            </div>
            <hr />
            <table className='table table-striped table-hover'>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Lot Number</th>
                  <th>Expiration</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total Value</th>
                  <th>User</th>
                </tr>
              </thead>
              <tbody>
                {ship.transactions.map((t, i) => (
                  <tr key={i}>
                    <td>
                      <StockcardLink dbName={dbName} transaction={t}>
                        {t.item}
                      </StockcardLink>
                    </td>
                    <td>{t.category}</td>
                    <td>{t.lotNum}</td>
                    <td>{h.expiration(t.expiration)}</td>
                    <td>{t.quantity}</td>
                    <td>{h.currency(t.unitPrice)}</td>
                    <td>{h.currency(t.totalValue)}</td>
                    <td>{t.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  { getShipment }
)(ShipmentPage)
