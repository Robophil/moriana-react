import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import h from 'helpers'
import ShipmentLink from 'shipment-link'

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { id, dbName } = this.props.match.params
    this.props.getShipment(dbName, id)
  }

  render () {
    const ship = this.props.currentShipment || { transactions: [] }
    const { dbName } = this.props.match.params
    return (
      <div className='shipment-page'>
        {this.props.loading ? (
          <div className='loader'></div>
        ) : (
          <div>
            <h5 className="text-capitalize">
              <i className="icon mail-solid"></i>{ship.prettyType}: {ship.from} to {ship.to}
            </h5>
            <hr />
            <div className="shipment-details">
              <strong>{h.formatDate(ship.date)}</strong> ({h.dateFromNow(ship.date)})
              <strong> {ship.totalTransactions}</strong> transactions
              total value <strong>{h.num(ship.totalValue)} </strong>

               | created by <strong>{ship.username} </strong>
                latest edited <strong>{h.dateFromNow(ship.updated)} </strong>
                | <ShipmentLink type='edit' id={ship._id} dbName={dbName} > edit </ShipmentLink>
                | <ShipmentLink type='print' id={ship._id} dbName={dbName} > print </ShipmentLink>
                | <ShipmentLink type='print' id={`${ship._id}/reversed`} dbName={dbName} > print reversed </ShipmentLink>
            </div>
            <hr />
            <table className="table table-striped table-hover">
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
                    <td><a href="#d/moriana_central_warehouse/stockcard/MEDICAL%20SUPPLIES/Gauze%20swabs%20100*100*8ply%20100/">{t.item}</a></td>
                    <td>{t.category}</td>
                    <td>{t.lotNum}</td>
                    <td>{t.expiration}</td>
                    <td>{t.quantity}</td>
                    <td>{h.num(t.unitPrice)}</td>
                    <td>{h.num(t.totalValue)}</td>
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