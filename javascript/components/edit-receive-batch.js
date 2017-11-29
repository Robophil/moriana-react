import React from 'react'
import Moment from 'moment'
import ClickOutHandler from 'react-onclickout'

import h, {setCursorAtEnd, preventDefault} from 'utils/helpers'
import { displayItemName, searchItems } from 'store/items'
import SearchDrop from 'components/search-drop'
import EditTransactionsTable from 'components/edit-transactions-table'
import NewItem from 'components/new-item'
import StaticInput from 'components/static-input'
import { isPresentAndNumber, numberInputIsValid, expirationIsValid } from 'utils/validation'
import { getISOExpirationFromInput, getTransactionFromInput } from 'utils/input-transforms'

export default class EditBatch extends React.Component {
  state = {
    item: '',
    category: '',
    expiration: '',
    lot: '',
    quantity: '',
    unitPrice: '',

    isEditing: false,
    isEditingNewItem: false,
    isNewBatch: false,
    index: null,
    expirationDisplay: null,
    quantityError: false,
    expirationError: false,
    unitPriceError: false,
  }

  showNewItem = (itemName) => {
    this.setState({ item: itemName, isEditingNewItem: true })
  }

  closeNewItem = () => {
    this.setState({ isEditingNewItem: false })
  }

  newItemComplete = (item, category) => {
    this.props.addItem({item, category})
    this.showEditBatch({item, category})
  }

  showEditBatch = (value) => {
    const {item, category} = value
    this.setState({ item, category, isEditing: true, isEditingNewItem: false, isNewBatch: true })
  }

  transactionEditClick = (index) => {
    const {transactions} = this.props
    let {item, category, quantity, expiration, lot, unitPrice} = transactions[index]
    index = Number(index)
    let expirationDisplay
    if (expiration) {
      expirationDisplay = h.expiration(getISOExpirationFromInput(expiration))
    } else {
      expiration = ''
      expirationDisplay = null
    }
    lot = lot || ''
    unitPrice = unitPrice || ''
    this.setState({ isEditing: true, isNewBatch: false, expirationDisplay, item, category, quantity, expiration, lot, unitPrice, index })
  }

  hideEditBatch = () => {
    this.setState({
      isEditing: false, index: null, expirationDisplay: null, item: '', category: '', expiration: '', lot: '', quantity: '', unitPrice: '', })
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.submitEdits()
        break
      }
      case 'ESCAPE': {
        this.hideEditBatch()
        break
      }
    }
  }

  cancelClicked = (event) => {
    event.stopPropagation()
    this.hideEditBatch()
  }

  valueChanged = (event) => {
    const {key} = event.currentTarget.dataset
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

  quantityBlur = (event) => {
    if (!isPresentAndNumber(this.state.quantity)) {
      this.setState({ quantityError: true })
    }
  }

  expirationBlur = () => {
    const {expiration} = this.state
    if (!expirationIsValid(expiration)) {
      this.setState({ expirationError: true })
    } else {
      this.setState({ expirationDisplay: h.expiration(getISOExpirationFromInput(expiration)) })
    }
  }

  onExpirationEditClick = () => {
    this.setState({
      expiration: this.state.expirationDisplay,
      expirationDisplay: null
    })
  }

  unitPriceBlur = (event) => {
    if (!numberInputIsValid(this.state.unitPrice)) {
      this.setState({ unitPriceError: true })
    }
  }

  submitEdits = (event) => {
    if (event) event.preventDefault()
    const {quantityError, expirationError, unitPriceError} = this.state
    if (!quantityError && !expirationError && !unitPriceError) {
      const { item, category, quantity, expiration, lot, unitPrice, index } = this.state
      const editedTransaction = getTransactionFromInput({ item, category, quantity, expiration, lot, unitPrice })
      this.props.updateShipment('receive_transaction', { index, editedTransaction })
      this.hideEditBatch()
    }
  }

  transactionDeleted = () => {
    this.props.updateShipment('receive_transaction', { deleted: true, index: this.state.index })
    this.hideEditBatch()
  }

  render () {
    const { items, itemsLoading, transactions, categories } = this.props
    const { item, category, expiration, lot, unitPrice, quantity } = this.state
    const { isEditing, isEditingNewItem, expirationDisplay, isNewBatch } = this.state
    const { quantityError, expirationError, unitPriceError } = this.state
    return (
      <div>
        <form onSubmit={this.searchDropSubmit}>
          <SearchDrop
            rows={items}
            loading={itemsLoading}
            value={{}}
            valueSelected={this.showEditBatch}
            onNewSelected={this.showNewItem}
            label={'Search Items'}
            resourceName={'Item'}
            displayFunction={displayItemName}
            searchFilterFunction={searchItems}
            className='search-items'
          />
        </form>
        <EditTransactionsTable
          transactions={transactions}
          onEditClick={this.transactionEditClick}
        />
        {isEditing && (
          <ClickOutHandler onClickOut={this.hideEditBatch}>
            <div className='modal edit-batch'>
              <div>
                <button className='close' onMouseDown={this.hideEditBatch}>
                  <span>×</span>
                </button>
                <h5>{item} {category}</h5>
              </div>
              <form onSubmit={this.submitEdits}>
                <div className={`row ${quantityError ? 'error' : ''}`}>
                  <label>Quantity</label>
                  <div className='input-group'>
                    <input
                      type='text'
                      value={quantity}
                      data-key='quantity'
                      onChange={this.valueChanged}
                      onKeyDown={this.onKeyDown}
                      onBlur={this.quantityBlur}
                      autoFocus
                      onFocus={setCursorAtEnd}
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
                        onBlur={this.expirationBlur}
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
                      onBlur={this.unitPriceBlur}
                      onKeyDown={this.onKeyDown}
                    />
                    {unitPriceError && (<p className='error'>
                      Unit price must be a number.
                    </p>)}
                  </div>
                </div>
                <button onMouseDown={this.hideEditBatch}>Cancel</button>
                <button onClick={this.submitEdits} className='button button-primary'>Done</button>
                {!isNewBatch && (
                  <button onMouseDown={this.transactionDeleted} className='pull-right'>delete</button>
                )}
              </form>
            </div>
          </ClickOutHandler>
        )}
        {isEditingNewItem && (
          <NewItem
            value={item}
            closeClicked={this.closeNewItem}
            valueUpdated={this.newItemComplete}
            categories={categories}
          />
        )}
      </div>
    )
  }
}
