import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'
import Moment from 'moment'
import { isPresentAndNumber, numberInputIsValid, expirationIsValid } from 'validation'
import { getISOExpirationFromInput } from 'input-transforms'
import StaticInput from 'static-input'
import ClickOutHandler from 'react-onclickout'

export default class EditTransferBatch extends React.Component {
  state = { error: false, quantity: '', transactions: [] }

  componentDidMount = () => {
    this.setState({
      quantity: this.props.itemTransferQuantity || ''
    })

    const { dbName, currentLocationName, category, item, date } = this.props
    this.props.getStockForEdit(dbName, currentLocationName, category, item, date)
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
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
    const error = !numberInputIsValid(quantity)
    this.setState({ quantity, error })
  }

  quantityConfirmed = (event) => {
    if (event) event.preventDefault()
    console.log('quantity confirmed')
  }

  done = (event) => {
    if (event) event.preventDefault()
    console.log('save shipment')
    // this.props.closeClicked()
  }

  deleteClicked = () => {
    this.props.deleteClicked()
    this.props.closeClicked()
  }

  render () {
    const { item, category, batch, closeClicked, deleteClicked, itemStock, itemStockLoading } = this.props
    const { error, quantity, transactions } = this.state
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
          {itemStockLoading ? (<div className='loader'></div>) : (
            <form onSubmit={this.quantityConfirmed}>
              <div className={`${error ? 'error' : ''}`}>
                <label>Quantity</label>
                <div className='input-group'>
                  <input
                    type='text'
                    value={quantity}
                    data-key='quantity'
                    onChange={this.quantityChanged}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.onBlur}
                    autoFocus
                  />
                  {error && (<p className='error'>
                    Quantity is required and must be numeric.
                  </p>)}
                </div>
              </div>
              <button onClick={this.quantityConfirmed} className='button-primary'>Confirm Quantity</button>
              <br /><br />
              <table>
                <thead>
                  <tr>
                    <th>Expiration</th>
                    <th>Lot</th>
                    <th>Stock</th>
                    <th className='text-capitalize'>Quantity</th>
                    <th>Resulting Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {itemStock.map((t,i) => (
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
              <button onMouseDown={closeClicked}>Cancel</button>
              <button onClick={this.done}>Done</button>
              {batch && (
                <button onMouseDown={this.deleteClicked} className='pull-right'>delete</button>
              )}
            </form>
          )}
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
  getStockForEdit: PropTypes.func.isRequired,
  dbName: PropTypes.string.isRequired,
  currentLocationName: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  itemStock: PropTypes.array.isRequired,
  itemStockLoading: PropTypes.bool.isRequired,
  batch: PropTypes.object,
  itemTransferQuantity: PropTypes.number
}
