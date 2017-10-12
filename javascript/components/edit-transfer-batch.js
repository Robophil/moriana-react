import React from 'react'
import PropTypes from 'prop-types'
import h, {setCursorAtEnd} from 'helpers'
import Moment from 'moment'
import { isPresentAndNumber, quantityIsValid, expirationIsValid } from 'validation'
import { getISOExpirationFromInput, mergeTransferQuantityWithStock } from 'input-transforms'
import { getTotalAvailableStock } from 'stock'
import StaticInput from 'static-input'
import ClickOutHandler from 'react-onclickout'

export default class EditTransferBatch extends React.Component {
  state = { quantityError: false, edited: false, quantity: '', displayTransactions: [], insufficientStockError: false, totalAvailableStock: 0 }

  componentDidMount = () => {
    const { dbName, currentLocationName, category, item, date, itemTransferQuantity } = this.props
    this.setState({ quantity: itemTransferQuantity || '' })
    this.props.getStockForEdit(dbName, currentLocationName, category, item, date)
  }

  componentWillReceiveProps = (newProps) => {
    const totalAvailableStock = getTotalAvailableStock(newProps.itemStock)
    this.setState({ totalAvailableStock })
    this.makeDisplayTransactions(this.props.itemTransferQuantity, newProps.itemStock, totalAvailableStock)
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
    const quantityError = !quantityIsValid(quantity)
    this.setState({ quantity, quantityError, insufficientStockError: false })
  }

  quantityConfirmed = (event) => {
    if (event) event.preventDefault()
    if (!this.state.quantityError) {
      this.setState({ edited: true })
      this.makeDisplayTransactions(this.state.quantity, this.props.itemStock, this.state.totalAvailableStock)
    }
  }

  makeDisplayTransactions = (quantity, itemStock, totalAvailableStock) => {
    if (quantity > totalAvailableStock) {
      this.setState({ insufficientStockError: true })
    } else {
      this.setState({
        displayTransactions: mergeTransferQuantityWithStock(quantity, itemStock),
        insufficientStockError: false
      })
    }
  }

  done = (event) => {
    if (event) event.preventDefault()
    const {insufficientStockError, quantityError} = this.state
    if (!insufficientStockError && !quantityError) {
      if (this.props.itemTransferQuantity !== Number.parseInt(this.state.quantity)) {
        this.props.valueUpdated('transaction', this.state.displayTransactions)
      }
      this.props.closeClicked()
    }
  }

  deleteClicked = () => {
    this.props.deleteClicked()
    this.props.closeClicked()
  }

  render () {
    const { item, category, batch, closeClicked, deleteClicked, itemStock, itemStockLoading } = this.props
    const { quantityError, edited, quantity, displayTransactions, insufficientStockError, totalAvailableStock } = this.state
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
              <div className={`${quantityError ? 'error' : ''}`}>
                <label>Quantity</label>
                <div className='input-group'>
                  <input
                    type='text'
                    value={quantity}
                    onChange={this.quantityChanged}
                    onKeyDown={this.onKeyDown}
                    onBlur={this.onBlur}
                    autoFocus
                    onFocus={setCursorAtEnd}
                  />
                  {quantityError && (<p className='error'>
                    Quantity is required and must be numeric.
                  </p>)}
                  {insufficientStockError && (<p className='error'>
                    Insufficient stock. Maximum available quantity is {h.num(totalAvailableStock)}.
                  </p>)}
                </div>
              </div>
              <button onClick={this.quantityConfirmed} className='button-primary'>Confirm Quantity</button>
              <br /><br />
              <table className='no-hover center-table'>
                <thead>
                  <tr>
                    <th>Expiration</th>
                    <th>Lot</th>
                    <th>Stock</th>
                    <th>Transfer Quantity</th>
                    <th>Resulting Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {displayTransactions.map((t,i) => (
                    <tr key={i}>
                      <td>{h.expiration(t.expiration)}</td>
                      <td>{t.lot}</td>
                      <td>{h.num(t.sum)}</td>
                      <td>{h.num(t.quantity)}</td>
                      <td>{h.num(t.resultingQuantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onMouseDown={closeClicked}>Cancel</button>
              {edited ? (<button onClick={this.done}>Confirm edits</button>) : (<button className='disabled'>Confirm edits</button>)}
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
