import React from 'react'
import ClickOutHandler from 'react-onclickout'
import PropTypes from 'prop-types'

export default class DeleteShipmentModal extends React.Component {
  render () {
    const {onClose, onConfirm, shipmentName} = this.props
    return (
      <ClickOutHandler onClickOut={onClose}>
        <div className='modal delete-modal'>
          <div>
            <button className='close' onClick={onClose}><span>×</span></button>
            <h5>Confirm Delete?</h5>
          </div>
          <div>
            Confirm delete <strong>{shipmentName}</strong>?
            <div>
              <button onClick={onConfirm}>yes, delete shipment</button>
              <button onClick={onClose} className='button-primary'>Cancel, don't delete</button>
              <p className='warning'>This action cannot be undone.</p>
            </div>
          </div>
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
