import React from 'react'
import ClickOutHandler from 'react-onclickout'
import PropTypes from 'prop-types'

export default class DeleteShipmentModal extends React.Component {
  render () {
    const {onClose, onConfirm, shipmentName} = this.props
    return (
      <ClickOutHandler onClickOut={onClose}>
        <div className='clickout-modal'>
          <div className='modal-header'>
            <button type='button' className='close' onClick={onClose}><span>×</span></button>
            <h4 className='modal-title'>Confirm Delete?</h4>
          </div>
          <div className='modal-body'>
            Confirm delete <strong>{shipmentName}</strong>?
            <button onClick={onConfirm} className='btn btn-default btn-sm'>yes, delete shipment</button>
            <button onClick={onClose} type='button' className='btn btn-primary'>Cancel, don't delete</button>
            <p className='help-block warning'>This action cannot be undone.</p>
          </div>
          <br />
        </div>
      </ClickOutHandler>
    )
  }
}

DeleteShipmentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  shipmentName: PropTypes.string.isRequired,
}
