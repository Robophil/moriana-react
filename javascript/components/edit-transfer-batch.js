import React from 'react'
import Moment from 'moment'
import h, {setCursorAtEnd, preventDefault} from 'helpers'
import { displayItemName, searchItems } from 'items'
import { quantityIsValid } from 'validation'
import { mergeTransferQuantityWithStock, getTransferTransactionsFromDisplay } from 'input-transforms'
import { getItemTotalQuantity, getTotalAvailableStock } from 'stock'
import SearchDrop from 'search-drop'
import EditTransactionsTable from 'edit-transactions-table'
import ClickOutHandler from 'react-onclickout'

export default class EditTransferBatch extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.getDefaultState()
  }

  getDefaultState = () => {
    return {
      item: '',
      category: '',
      quantity: '',
      totalAvailableStock: 0,
      displayTransactions: [],
      quantityError: false,
      insufficientStockError: false,
      isEditing: false,
      isEditFromShipment: false,
      changed: false
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (this.props.itemStockLoading && !newProps.itemStockLoading) {
      const totalAvailableStock = getTotalAvailableStock(newProps.itemStock)
      const originalQuantity = getItemTotalQuantity(this.props.transactions, this.state.item, this.state.category)
      const quantity = originalQuantity || ''
      this.setState({ totalAvailableStock, originalQuantity, quantity })
      this.makeDisplayTransactions(newProps.itemStock, totalAvailableStock, quantity)
    }
  }

  showEdit = ({ item, category }, isEditFromShipment) => {
    this.setState({ isEditing: true, item, category, isEditFromShipment: isEditFromShipment })
    this.props.getStockOnItem(item, category)
  }

  hideEdit = () => {
    this.setState(this.getDefaultState())
  }

  onClickTransaction = (index) => {
    const { item, category } = this.props.transactions[index]
    this.showEdit({item, category}, true)

  }

  onChangeQuantity = (event) => {
    const quantity = event.currentTarget.value
    const quantityError = !quantityIsValid(quantity)
    this.setState({ quantity, quantityError, insufficientStockError: false })
  }

  onKeyDownQuantity = (event) => {
    const key = h.keyMap(event.keyCode)
    if (key === 'ESCAPE') {
      this.hideEdit()
    } else if (key === 'ENTER') {
      this.onSubmitQuantity()
    }
  }

  onSubmitQuantity = (event) => {
    if (event) event.preventDefault()
    if (!this.state.quantityError) {
      const { totalAvailableStock, quantity } = this.state
      this.setState({ changed: true })
      this.makeDisplayTransactions(this.props.itemStock, totalAvailableStock, quantity)
    }
  }

  makeDisplayTransactions = (itemStock, totalAvailableStock, quantity) => {
    if (quantity > totalAvailableStock) {
      this.setState({ insufficientStockError: true })
    } else {
      this.setState({
        displayTransactions: mergeTransferQuantityWithStock(quantity, itemStock),
        insufficientStockError: false
      })
    }
  }

  onSubmitEdits = () => {
    const {
      insufficientStockError,
      quantityError,
      displayTransactions,
      originalQuantity,
      item,
      category,
      quantity
    } = this.state
    if (!insufficientStockError && !quantityError) {
      if (originalQuantity !== Number.parseInt(quantity)) {
        const editedTransactions = getTransferTransactionsFromDisplay(displayTransactions)
        this.props.updateShipment('transfer_transactions', { editedTransactions, item, category })
      }
      this.hideEdit()
    }
  }

  onDeleteClicked = () => {
    const { item, category } = this.state
    this.props.updateShipment('transfer_transactions', { deleted: true, item, category })
    this.hideEdit()
  }

  render () {
    const { items, itemsLoading, transactions, itemStockLoading } = this.props
    const {
      item,
      category,
      quantity,
      totalAvailableStock,
      displayTransactions,
      quantityError,
      insufficientStockError,
      isEditing,
      isEditFromShipment,
      changed
    } = this.state
    return (
      <div>
        <form onSubmit={preventDefault}>
          <SearchDrop
            rows={items}
            loading={itemsLoading}
            value={{}}
            valueSelected={this.showEdit}
            label={'Search Items'}
            resourceName={'Item'}
            displayFunction={displayItemName}
            searchFilterFunction={searchItems}
            className='search-items'
          />
        </form>
        <EditTransactionsTable
          transactions={transactions}
          onEditClick={this.onClickTransaction}
        />
        {isEditing && (
          <ClickOutHandler onClickOut={this.hideEdit}>
            <div className='modal edit-batch'>
              <div>
                <button className='close' onMouseDown={this.hideEdit}> <span>×</span> </button>
                <h5>{item} {category}</h5>
              </div>
              {itemStockLoading ? (<div className='loader'></div>) : (
                <form onSubmit={this.onSubmitQuantity}>
                  <div className={`${quantityError ? 'error' : ''}`}>
                    <label>Quantity</label>
                    <div className='input-group'>
                      <input
                        type='text'
                        value={quantity}
                        onChange={this.onChangeQuantity}
                        onKeyDown={this.onKeyDownQuantity}
                        onFocus={setCursorAtEnd}
                        autoFocus
                      />
                      {quantityError && (<p className='error'>
                        Quantity is required and must be numeric.
                      </p>)}
                      {insufficientStockError && (<p className='error'>
                        Insufficient stock. Maximum available quantity is {h.num(totalAvailableStock)}.
                      </p>)}
                    </div>
                  </div>
                  <br /><br />
                  <button onClick={this.onSubmitQuantity} className='button-primary'>Confirm Quantity</button>
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
                  <button onMouseDown={this.hideEdit}>Cancel</button>
                  { (changed && !quantityError && !insufficientStockError)
                    ? (<button onClick={this.onSubmitEdits}>Confirm edits</button>)
                    : (<button className='disabled'>Confirm edits</button>)
                  }
                  {isEditFromShipment && (
                    <button onMouseDown={this.onDeleteClicked} className='pull-right'>delete</button>
                  )}
                </form>
              )}
            </div>
          </ClickOutHandler>
        )}
      </div>
    )
  }
}
