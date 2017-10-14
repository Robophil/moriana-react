import React from 'react'
import h from 'helpers'
import displayPatient from 'display-patient'

export default class StaticShipmentDetails extends React.Component {
  render () {
    const { totalTransactions, totalValue, vendorId, date, patient, to } = this.props.shipment
    return (
      <div>
        <strong>{h.formatDate(date)}</strong> |
        transactions: <strong>{h.num(totalTransactions)}</strong>
        &nbsp;| total value: <strong>{h.currency(totalValue)}</strong>
        {vendorId && (<span> | vendor ID: <strong>{vendorId}</strong></span>)}
        &nbsp; &nbsp; {this.props.children}
        {patient && (
          <div>
            Patient Details: {displayPatient(Object.assign(patient, { name: to }))}
          </div>
        )}
      </div>
    )
  }
}
