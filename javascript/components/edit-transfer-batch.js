import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'
import Moment from 'moment'
import { isPresentAndNumber, numberInputIsValid, expirationIsValid } from 'validation'
import { getISOExpirationFromInput } from 'input-transforms'
import StaticInput from 'static-input'
import ClickOutHandler from 'react-onclickout'

export default class EditTransferBatch extends React.Component {
  state = { error: null, quantity: '' }

  componentDidMount = () => {
    let quantity = this.props.transactions.reduce((memo, t) => {
      memo += t.quantity
      return memo
    }, 0)
    quantity = quantity || ''
    this.setState({quantity})
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

  quantityChanged = (event) => {
    const quantity = event.currentTarget.value
    this.setState({ quantity })
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    this.props.closeClicked()
  }

  deleteClicked = () => {
    this.props.deleteClicked()
    this.props.closeClicked()
  }

  render () {
    const { item, category, batch, transactions, closeClicked, deleteClicked } = this.props
    const { error, quantity } = this.state
    return (
      <ClickOutHandler onClickOut={closeClicked}>
        <div className='clickout-modal'>
          <div className='modal-header'>
            {/* use onmousedown to beat out race with input blur events */}
            <button type='button' className='close' onMouseDown={closeClicked}>
              <span>×</span>
            </button>
            <h4 className='modal-title'>{item} {category}</h4>
          </div>
          <div>
            <div className={`form-group ${error ? 'has-error' : ''}`}>
              <label className='col-lg-2 control-label'>Quantity</label>
              <div className='col-lg-9 input-group'>
                <input
                  type='text'
                  className='form-control form-input'
                  value={quantity}
                  data-key='quantity'
                  onChange={this.quantityChanged}
                  onKeyDown={this.onKeyDown}
                  onBlur={this.onBlur}
                  autoFocus
                />
                {error && (<p className='error help-block'>
                  Quantity is required and must be numeric.
                </p>)}
              </div>
            </div>
            <button className='btn btn-primary'>Confirm Quantity</button>
            <br /><br />
            <table className='table table-striped text-center table-bordered table-small table-hover'>
              <thead>
                <tr>
                  <th className='text-center'>Expiration</th>
                  <th className='text-center'>Lot</th>
                  <th className='text-center'>Stock</th>
                  <th className='text-capitalize'>Quantity</th>
                  <th className='text-center'>Resulting Stock</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t,i) => (
                  <tr key={i}>
                    <td>{h.expiration(t.expiration)}</td>
                    <td>{t.lot}</td>
                    <td>{h.num(t.stock)}</td>
                    <td>{h.num(t.quantity)}</td>
                    <td>{h.num(t.result)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onMouseDown={closeClicked} style={{marginRight: '5px'}} className='btn btn-default'>Cancel</button>
            <button onClick={this.onSubmit} className='btn btn-primary'>Done</button>
            {batch && (
              <button onMouseDown={this.deleteClicked} className='btn btn-default pull-right'>delete</button>
            )}
          </div>
        </div>
      </ClickOutHandler>
    )
  }
}

EditTransferBatch.propTypes = {
  item: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
  deleteClicked: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
  batch: PropTypes.object
}
