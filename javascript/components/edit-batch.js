import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'
import { isPresentAndNumber, numberInputIsValid, expirationIsValid } from 'validation'
import { getISOExpirationFromInput } from 'input-transforms'
import StaticInput from 'static-input'

export default class EditBatch extends React.Component {
  state = {
    quantity: '',
    quantityError: false,
    quantityValidationFunction: isPresentAndNumber,
    expiration: '',
    expirationError: false,
    expirationValidationFunction: expirationIsValid,
    lot: '',
    unitPrice: '',
    unitPriceError: false,
    unitPriceValidationFunction: numberInputIsValid,
    expirationDisplay: null
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.onSubmit()
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
    }
  }

  cancelClicked = (event) => {
    event.stopPropagation()
    this.props.closeClicked()
  }

  valueChanged = (event) => {
    const key = event.currentTarget.dataset.key
    const stateUpdate = {}
    stateUpdate[key] = event.currentTarget.value
    stateUpdate[`${key}Error`] = false
    this.setState(stateUpdate)
  }

  onBlur = (event) => {
    const {key} = event.currentTarget.dataset
    const {value} = event.currentTarget
    const isValid = this.state[`${key}ValidationFunction`](value)
    if (!isValid) {
      this.setError(key)
    } else if (key === 'expiration') {
      this.setState({ expirationDisplay: h.expiration(getISOExpirationFromInput(value)) })
    }
  }

  setError = (key) => {
    const newState = { }
    newState[`${key}Error`] = true
    this.setState(newState)
  }

  onExpirationEditClick = () => {
    this.setState({ expirationDisplay: null })
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    const { item, category } = this.props
    const { quantity, expiration, lot, unitPrice } = this.state
    let formHasError = false
    const keys = ['quantity', 'expiration', 'unitPrice']
    keys.forEach(key => {
      const isValid = this.state[`${key}ValidationFunction`](this.state[key])
      if (!isValid) {
        formHasError = true
        this.setError(key)
      }
    })
    if (!formHasError) {
      this.props.valueUpdated('receive_transactions', { item, category, quantity, expiration, lot, unitPrice })
      this.props.closeClicked()
    }
  }

  render () {
    const { item, category, closeClicked } = this.props
    const { quantity, quantityError, expiration, expirationError, lot, unitPrice, unitPriceError, expirationDisplay } = this.state
    return (
      <div className='modal fade in'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              {/* use onmousedown to beat out race with input blur events */}
              <button type='button' className='close' onMouseDown={closeClicked}>
                <span>×</span>
              </button>
              <h4 className='modal-title'>{item} {category}</h4>
            </div>
            <div className='modal-body'>
              <div>
                <div className={`form-group ${quantityError ? 'has-error' : ''}`}>
                  <label className='col-lg-2 control-label'>Quantity</label>
                  <div className='col-lg-9 input-group'>
                    <input
                      type='text'
                      className='form-control form-input'
                      value={quantity}
                      data-key='quantity'
                      onChange={this.valueChanged}
                      onKeyDown={this.onKeyDown}
                      onBlur={this.onBlur}
                      autoFocus
                    />
                    {quantityError && (<p className='error help-block'>
                      Quantity is required and must be numeric.
                    </p>)}
                  </div>
                </div>
                {expirationDisplay ? (
                  <StaticInput label={'Expiration'} value={expirationDisplay} onEditClick={this.onExpirationEditClick} />
                ) : (
                  <div className={`form-group ${expirationError ? 'has-error' : ''}`}>
                    <label className='col-lg-2 control-label'>Expiration</label>
                    <div className='col-lg-9 input-group'>
                      <input
                        type='text'
                        className='form-control form-input'
                        value={expiration}
                        data-key='expiration'
                        onChange={this.valueChanged}
                        onBlur={this.onBlur}
                        onKeyDown={this.onKeyDown}
                      />
                      {expirationError && (<p className='error help-block'>
                        Expiration must be format "MM/YY", "MM/YYYY" or "YYYY-MM-DD".
                      </p>)}
                    </div>
                  </div>
                )}
                <div className='form-group'>
                  <label className='col-lg-2 control-label'>Lot</label>
                  <div className='col-lg-9 input-group'>
                    <input
                      type='text'
                      className='form-control form-input'
                      value={lot}
                      data-key='lot'
                      onChange={this.valueChanged}
                      onKeyDown={this.onKeyDown}
                    />
                  </div>
                </div>
                <div className={`form-group ${unitPriceError ? 'has-error' : ''}`}>
                  <label className='col-lg-2 control-label'>Unit Price</label>
                  <div className='col-lg-9 input-group'>
                    <input
                      type='text'
                      className='form-control form-input'
                      value={unitPrice}
                      data-key='unitPrice'
                      onChange={this.valueChanged}
                      onBlur={this.onBlur}
                      onKeyDown={this.onKeyDown}
                    />
                    {unitPriceError && (<p className='error help-block'>
                      Unit price must be a number.
                    </p>)}
                  </div>
                </div>
                <button onMouseDown={closeClicked} style={{marginRight: '5px'}} className='btn btn-default'>Cancel</button>
                <button onClick={this.onSubmit} className='btn btn-primary'>Done</button>
                <br /><br />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditBatch.propTypes = {
  item: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired
}
