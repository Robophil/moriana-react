import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'

export default class EditShipmentDetails extends React.Component {
  render () {
    return (
      <div className='shipment-details'>
        <strong>August 10, 2017</strong> |
        transactions: <strong></strong>
        | total value: <strong>0.0</strong>
        &nbsp; <a href='#' className='toggle-details'>edit details</a>
      </div>
    )
  }
}

EditShipmentDetails.propTypes = {
  value: PropTypes.string,
  error: PropTypes.bool.isRequired,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
}
