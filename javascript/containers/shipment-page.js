import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import h from 'helpers'
import ShipmentLink from 'shipment-link'
import StaticShipmentDetails from 'static-shipment-details'
import {buildStockCardHref} from 'stockcard-link'

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const { id } = params
    this.props.getShipment(dbName, id)
  }

  stockLinkClicked = (event) => {
    const {item, category} = event.currentTarget.dataset
    window.location.href = buildStockCardHref(this.props.route.dbName, {item, category})
  }

  render () {
    const ship = this.props.currentShipment || { transactions: [] }
    const {displayType, shipmentType, allowEdit } = this.props
    const { dbName } = this.props.route
    return (
      <div className='shipment-page'>
        {this.props.loading ? (
          <div className='loader' />
        ) : (
          <div>
            <h5 className='text-capitalize'>
              {displayType}: {ship.from} to {ship.to}
            </h5>
            <div>
              <StaticShipmentDetails shipment={ship} />
              <br />
              <div>
                <ShipmentLink linkType='print' id={ship._id} dbName={dbName} >
                  print
                </ShipmentLink> |
                <ShipmentLink linkType='print' id={`${ship._id}/reversed`} dbName={dbName} >
                  print reversed
                </ShipmentLink> | &nbsp;
                {allowEdit ? (
                  <span>
                    <ShipmentLink
                      linkType='edit'
                      className='button button-small'
                      shipmentType={shipmentType}
                      id={ship._id}
                      dbName={dbName} >
                      edit
                    </ShipmentLink>
                  </span>
                ) : (<span>(editing only available on <span className='text-capitalize'>{ship.from}</span> database)</span>)}
              </div>
            </div>
            <hr />
            <table>
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
                  <tr key={i} data-item={t.item} data-category={t.category} onClick={this.stockLinkClicked}>
                    <td>{t.item}</td>
                    <td>{t.category}</td>
                    <td>{t.lot}</td>
                    <td>{h.expiration(t.expiration)}</td>
                    <td>{h.num(t.quantity)}</td>
                    <td>{h.currency(t.unitPrice)}</td>
                    <td>{h.currency(t.totalValue)}</td>
                    <td>{t.username}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='footer-link'>
              <a href={`/#d/${this.props.route.dbName}/`}>Go to all shipments</a>
            </div>
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
