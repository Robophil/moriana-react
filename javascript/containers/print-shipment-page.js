import React from 'react'
import { connect } from 'react-redux'
import config from 'config'
import { getShipment } from 'store/shipments'
import h from 'utils/helpers'
import ShipmentLink from 'components/shipment-link'
import StaticShipmentDetails from 'components/static-shipment-details'
import {buildStockCardHref} from 'components/stockcard-link'

const T_PER_PAGE = 10

const PaperShipmentPage = (props) => {
  const {shipment, transactions, toName} = props
  const { deploymentName, backendUrl } = config
  return (
    <div className='page-break'>
      <div className='text-center'>
        <img src={`${backendUrl}${deploymentName}/_design/moriana/pih_letterhead.png`} />
      </div>
      <div>
        <p><strong>Issuing Facility:</strong> <span className='text-capitalize'>{shipment.from}</span></p>
        <p><strong>Issued To:</strong> <span className='text-capitalize'>{toName}</span></p>
        <p><strong>Date of Issue:</strong>{h.formatDate(shipment.date)}</p>
        {shipment.vendorId && (<p><strong>Vendor ID: </strong>{shipment.vendorId}</p>)}
        <p><strong>Total Price (ZAR): </strong>{h.num(shipment.totalValue)}</p>
        <p><strong>Total Transactions: </strong>{h.num(shipment.totalTransactions)}</p>
      </div>
      <table className='no-hover'>
        <thead>
          <tr>
            <th></th>
            <th>Item</th>
            <th>Expiration</th>
            <th>Lot Number</th>
            <th>Quantity Issued</th>
            <th>Quantity Received</th>
            <th>Unit Price</th>
            <th>Total Value</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t, i) => (
            <tr key={i}>
              <td>{t.number}</td>
              <td>{t.item} -- {t.category}</td>
              <td>{h.expiration(t.expiration)}</td>
              <td>{t.lot}</td>
              <td>{h.num(t.quantity)}</td>
              <td></td>
              <td>{h.currency(t.unitPrice)}</td>
              <td>{h.currency(t.totalValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='clearfix'>
        <div className='issued-by'><strong>Issued By:</strong>
          <br /><br /> Name: _____________________________
          <br />
          <br /> Date: _____________________________
          <br />
          <br /> Signature: _____________________________
        </div>
        <div className='received-by'><strong>Received By:</strong>
          <br /><br /> Name: _____________________________
          <br />
          <br /> Date: _____________________________
          <br />
          <br /> Signature: _____________________________
        </div>
      </div>
    </div>
  )
}

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { dbName } = this.props.route
    const { id } = this.props.route.params
    this.props.getShipment(dbName, id)
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.loading && !newProps.loading) {
      setTimeout(window.print, 1200)
    }
  }

  render () {
    const shipment = this.props.currentShipment || { transactions: [] }
    const {shipmentType} = this.props
    let toName = shipment.to
    if (shipmentType === 'dispense') {
      if (shipment.patient && shipment.patient.identifier) {
        toName = 'Patient Identifier: ' + shipment.patient.identifier
      } else {
        toName = 'Patient (No Identifier)'
      }
    }
    const { reversed } = this.props.route.params
    if (!reversed) shipment.transactions.reverse()
    const numberOfPages = Math.ceil(shipment.transactions.length / T_PER_PAGE)
    // i.e. Python: [[] for n in range(10)]]
    const pages = [...Array(numberOfPages).keys()].map(i => [])
    shipment.transactions.forEach((t, i) => {
      t.number = i + 1
      pages[Math.floor(i / T_PER_PAGE)].push(t)
    })
    return (
      <div className='print-shipment-page'>
        {this.props.loading ? (
          <div className='loader' />
        ) : pages.map((ts, i) => (<PaperShipmentPage key={i} shipment={shipment} toName={toName} transactions={ts} />)) }
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  { getShipment }
)(ShipmentPage)
