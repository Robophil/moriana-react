import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'

export default class StaticShipmentDetails extends React.Component {
  render () {
    const { totalTransactions, totalValue, vendorId, date, patient } = this.props.shipment
    return (
      <div>
        <strong>{h.formatDate(date)}</strong> |
        transactions: <strong>{h.num(totalTransactions)}</strong>
        | total value: <strong>{h.currency(totalValue)}</strong>
        {vendorId && (<span> | vendor ID: <strong>{vendorId}</strong></span>)}
        &nbsp; &nbsp; {this.props.children}
        {patient && (
          <div>
            | Patient:
            {patient.dob && (<span>Date of birth: <strong>{h.formatDate(patient.dob)}</strong></span>)}
            {patient.identifier && (<span>Identifier: <strong>{patient.identifier}</strong></span>)}
            {patient.district && (<span>District: <strong>{patient.district}</strong></span>)}
            {patient.gender && (<span>Gender: <strong>{patient.gender}</strong></span>)}
          </div>
        )}
      </div>
    )
  }
}

StaticShipmentDetails.propTypes = {
  shipment: PropTypes.object.isRequired
}
