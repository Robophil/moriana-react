import React from 'react'
import h from 'utils/helpers'
import displayPatient from 'components/display-patient'

export default class StaticShipmentDetails extends React.Component {
  render () {
    const {
      totalTransactions,
      totalValue,
      vendorId,
      date,
      patient,
      to,
      username,
      updated
    } = this.props.shipment
    return (
      <div>
        <strong>{h.formatDate(date)}</strong> ({h.dateFromNow(date)}) |
        <strong> {h.num(totalTransactions)}</strong> transaction{h.soronos(totalTransactions)} |
        total value <strong>{h.currency(totalValue)} </strong> |
        {username && (<span> created by <strong>{username} </strong> |</span>)}
        {updated && (<span> latest edited <strong>{h.dateFromNow(updated)}</strong></span>)}
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
