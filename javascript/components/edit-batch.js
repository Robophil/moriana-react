import React from 'react'
import h from 'helpers'
import Moment from 'moment'
import { isPresentAndNumber, numberInputIsValid, expirationIsValid } from 'validation'
import { getISOExpirationFromInput, getTransactionFromInput } from 'input-transforms'
import StaticInput from 'static-input'
import ClickOutHandler from 'react-onclickout'

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

  componentDidMount = () => {
    if (this.props.batch) {
      const {quantity, expiration, lot, unitPrice} = this.props.batch
      const newState = {
        quantity,
        expiration: expiration || '',
        lot: lot || '',
        unitPrice: unitPrice || ''
      }
      if (expiration) {
        newState.expiration = h.expiration(expiration)
        newState.expirationDisplay = h.expiration(expiration)
      }
      this.setState(newState)
    }
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
      const inputTransaction = { item, category, quantity, expiration, lot, unitPrice }
      const transactionValue = getTransactionFromInput(inputTransaction)
      this.props.transactionUpdated(transactionValue)
      this.props.closeClicked()
    }
  }

  deleteClicked = () => {
    this.props.deleteClicked()
    this.props.closeClicked()
  }

  render () {
    const { item, category, closeClicked, deleteClicked, batch } = this.props
    const {
      quantity,
      quantityError,
      expiration,
      expirationError,
      lot,
      unitPrice,
      unitPriceError,
      expirationDisplay
    } = this.state
    return (
      <ClickOutHandler onClickOut={closeClicked}>
        <div className='modal edit-batch'>
          <div>
            {/* use onmousedown to beat out race with input blur events */}
            <button className='close' onMouseDown={closeClicked}>
              <span>×</span>
            </button>
            <h5>{item} {category}</h5>
          </div>
          <form onSubmit={this.onSubmit}>
            <div className={`row ${quantityError ? 'error' : ''}`}>
              <label>Quantity</label>
              <div className='input-group'>
                <input
                  type='text'
                  value={quantity}
                  data-key='quantity'
                  onChange={this.valueChanged}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                  autoFocus
                />
                {quantityError && (<p className='error'>
                  Quantity is required and must be numeric.
                </p>)}
              </div>
            </div>
            {expirationDisplay ? (
              <StaticInput label={'Expiration'} value={expirationDisplay} onEditClick={this.onExpirationEditClick} />
            ) : (
              <div className={`row ${expirationError ? 'has-error' : ''}`}>
                <label>Expiration</label>
                <div className='input-group'>
                  <input
                    type='text'
                    value={expiration}
                    data-key='expiration'
                    onChange={this.valueChanged}
                    onBlur={this.onBlur}
                    onKeyDown={this.onKeyDown}
                  />
                  {expirationError && (<p className='error'>
                    Expiration must be format "MM/YY", "MM/YYYY" or "YYYY-MM-DD".
                  </p>)}
                </div>
              </div>
            )}
            <div className='row'>
              <label>Lot</label>
              <div className='input-group'>
                <input
                  type='text'
                  value={lot}
                  data-key='lot'
                  onChange={this.valueChanged}
                  onKeyDown={this.onKeyDown}
                />
              </div>
            </div>
            <div className={`row ${unitPriceError ? 'has-error' : ''}`}>
              <label>Unit Price</label>
              <div className='input-group'>
                <input
                  type='text'
                  value={unitPrice}
                  data-key='unitPrice'
                  onChange={this.valueChanged}
                  onBlur={this.onBlur}
                  onKeyDown={this.onKeyDown}
                />
                {unitPriceError && (<p className='error'>
                  Unit price must be a number.
                </p>)}
              </div>
            </div>
            <button onMouseDown={closeClicked}>Cancel</button>
            <button onClick={this.onSubmit} className='button button-primary'>Done</button>
            {batch && (
              <button onMouseDown={this.deleteClicked} className='pull-right'>delete</button>
            )}
          </form>
        </div>
      </ClickOutHandler>
    )
  }
}
