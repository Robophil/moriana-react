import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import h from 'helpers'

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { id, dbName } = this.props.match.params
    this.props.getShipment(dbName, id)
  }

  render () {
    const ship = this.props.currentShipment || {}
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
              <strong>{ship.transactions.length}</strong> transactions
              total value <strong>{h.num(ship.totalValue)}</strong>

               | created by <strong>{ship.username}</strong>
               latest edited <strong>{h.dateFromNow(ship.updated)}</strong>
              | <a href="#d/moriana_central_warehouse/shipment/edit/00__2017-07-05T14:58:01.137Z__mokotjo__shipment__395055/">edit</a>
              | <a href="#d/moriana_central_warehouse/shipment/print/00__2017-07-05T14:58:01.137Z__mokotjo__shipment__395055/">print</a> | <a href="#d/moriana_central_warehouse/shipment/print/00__2017-07-05T14:58:01.137Z__mokotjo__shipment__395055/reversed">print reversed</a>
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
                  <tr>
                    <td><a href="#d/moriana_central_warehouse/stockcard/MEDICAL%20SUPPLIES/Gauze%20swabs%20100*100*8ply%20100/">Gauze swabs 100*100*8ply 100</a></td>
                    <td>MEDICAL SUPPLIES</td>
                    <td></td>
                    <td>01/2021</td>
                    <td>100</td>
                    <td>0.17</td>
                    <td>16.75</td>
                    <td>mokotjo</td>
                  </tr>
                  <tr>
                    <td><a href="#d/moriana_central_warehouse/stockcard/NTP%20consignment/Urine%20bag%202%20littre/">Urine bag 2 littre</a></td>
                    <td>NTP consignment</td>
                    <td></td>
                    <td>04/2019</td>
                    <td>10</td>
                    <td>2.71</td>
                    <td>27.10</td>
                    <td>mokotjo</td>
                  </tr>
                  <tr>
                    <td><a href="#d/moriana_central_warehouse/stockcard/MEDICAL%20SUPPLIES/Zinc%20Oxide%20Tape%2010cm%20*%205%20Meter%201%20roll/">Zinc Oxide Tape 10cm * 5 Meter 1 roll</a></td>
                    <td>MEDICAL SUPPLIES</td>
                    <td></td>
                    <td>08/2019</td>
                    <td>2</td>
                    <td>23.26</td>
                    <td>46.52</td>
                    <td>mokotjo</td>
                  </tr>
                  <tr>
                    <td><a href="#d/moriana_central_warehouse/stockcard/TOPICAL%20CREAM%2CLOTION%2COINTMENT%20%26%20SOLUTION%20PREPARATIONS/Eusol%20solution%202.5l/">Eusol solution 2.5l</a></td>
                    <td>TOPICAL CREAM,LOTION,OINTMENT &amp; SOLUTION PREPARATIONS</td>
                    <td></td>
                    <td>06/2019</td>
                    <td>2,500</td>
                    <td>0.01</td>
                    <td>37.20</td>
                    <td>mokotjo</td>
                  </tr>
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
