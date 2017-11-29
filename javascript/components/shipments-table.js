import React from 'react'
import h from 'utils/helpers'
import ShipmentLink from 'components/shipment-link'
import {buildHref} from 'components/shipment-link'

export default class extends React.Component {
  shipmentClicked = (event) => {
    if (event.target.nodeName !== 'A') {
      const {id} = event.currentTarget.dataset
      const href = buildHref(id, this.props.dbName)
      window.location.href = href
    }
  }
  render () {
    const {dbName} = this.props
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Transactions</th>
            <th>Value</th>
            <th>Last Edited</th>
            <th>Creator</th>
          </tr>
        </thead>
        <tbody>
          {this.props.shipments.map((row, i) => (
            <tr key={i} onClick={this.shipmentClicked} data-id={row.id}>
              <td className='date'>{h.formatDate(row.date)} <small> ({h.dateFromNow(row.date)})</small></td>
              <td className='text-capitalize'>{row.from}</td>
              <td className='text-capitalize'>{row.to}</td>
              <td>{row.totalTransactions}</td>
              <td>{h.num(row.value)}</td>
              <td><small>{h.dateFromNow(row.updated || row.date)}</small></td>
              <td>{row.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
