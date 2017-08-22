import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import { updateShipment, startNewShipmentAction } from 'editshipment'
import { displayLocationName, searchLocations, getLocations } from 'locations'
import { displayItemName, searchItems, getItems } from 'items'
import DateInput from 'date-input'
import SearchDrop from 'search-drop'
import VendorIdInput from 'vendor-id-input'
import NewLocation from 'new-location'
import EditBatch from 'edit-batch'
import StaticShipmentDetails from 'static-shipment-details'
import EditTransactionsTable from 'edit-transactions-table'
import StaticInput from 'static-input'
import ShipmentLink from 'shipment-link'
import DeleteShipmentModal from 'delete-shipment-modal'
import NewItem from 'new-item'

const ReceivePage = class extends React.Component {
  state = {
    showNewLocation: false,
    newLocationName: '',
    showEditDetails: true,
    showEditTransactions: false,
    showBatchEdit: false,
    editingItem: '',
    editingCategory: '',
    editingBatch: null,
    editingIndex: null,
    showDeleteModal: false,
    showNewItem: false
  }

  componentDidMount = () => {
    const { dbName, currentLocationName, params } = this.props.route
    if (params.id) {
      this.setState({ showEditDetails: false, showEditTransactions: true })
      this.props.getShipment(dbName, params.id)
    } else {
      this.props.startNewShipmentAction(currentLocationName, dbName, 'receive')
    }
    this.props.getItems(dbName, currentLocationName)
    this.props.getLocations(dbName, currentLocationName)
  }

  componentWillReceiveProps = (newProps) => {
    const {shipment} = newProps.editshipment
    if (shipment.from) {
      this.setState({ showNewLocation: false })
    }
    if (!this.props.route.params.id && this.props.editshipment.isNew && !newProps.editshipment.isNew) {
      const newHash = window.location.hash + '/' + shipment._id
      window.history.replaceState(undefined, undefined, newHash)
    }
  }

  toggleShowEditDetails = () => {
    const {from, to, date} = this.props.editshipment.shipment
    if (from && to && date) {
      this.setState({ showEditDetails: !this.state.showEditDetails, showEditTransactions: true })
    }
  }

  toggleNewReceiveLocation = (inputValue) => {
    this.setState({ showNewLocation: !this.state.showNewLocation, newLocationName: inputValue })
  }

  fromSelected = (value) => {
    this.props.updateShipment('from', value)
  }

  toggleNewBatch = (value) => {
    this.setState({ editingItem: value.item, editingCategory: value.category, showBatchEdit: true })
  }

  hideEditBatch = () => {
    this.setState({
      editingItem: null,
      editingCategory: null,
      editingBatch: null,
      editingIndex: null,
      showBatchEdit: false
    })
  }

  transactionEditClick = (index) => {
    const {shipment} = this.props.editshipment
    const {item, category, quantity, expiration, lot, unitPrice} = shipment.transactions[index]
    this.setState({
      editingItem: item,
      editingCategory: category,
      editingBatch: {quantity, expiration, lot, unitPrice},
      editingIndex: Number(index),
      showBatchEdit: true
    })
  }

  updateTransaction = (value) => {
    if (this.state.editingIndex !== null) {
      value.index = this.state.editingIndex
    }
    this.props.updateShipment('transaction', value)
  }

  deleteTransaction = () => {
    this.props.updateShipment('transaction', {delete: true, index: this.state.editingIndex})
  }

  toggleNewItem = (name) => {
    this.setState({ editingItem: name, showNewItem: true })
  }

  closeNewItem = () => {
    this.setState({ showNewItem: false })
  }

  newItemSelected = (item, category) => {
    this.setState({ showNewItem: false })
    this.toggleNewBatch({item, category})
  }

  toggleDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }

  deleteShipment = () => {
    this.props.updateShipment('delete_shipment', 'try delete!')
  }

  render () {
    const { shipment, loadingInitialShipment, isNew, shipmentName } = this.props.editshipment
    const { locations, items, updateShipment, route } = this.props
    const { dbName } = route
    return loadingInitialShipment ? (
      <div className='loader' />
      ) : (
        <div className='receive-page'>
          <h5 className='text-capitalize title'>
            {shipment.from ? (<span>Receive: {shipment.from} to {shipment.to}</span>) : (<span>Create receive</span>)}
          </h5>
          <hr />
          {this.state.showEditDetails ? (
            <div>
              <form className='form-horizontal edit-details-form'>
                <fieldset>
                  <DateInput
                    value={shipment.date}
                    valueUpdated={updateShipment}
                  />
                  <SearchDrop
                    rows={locations.externalLocations}
                    loading={locations.firstRequest}
                    value={{name: shipment.from, type: shipment.fromType, attributes: shipment.fromAttributes}}
                    valueSelected={this.fromSelected}
                    onNewSelected={this.toggleNewReceiveLocation}
                    label={'From Location'}
                    resourceName={'Location'}
                    displayFunction={displayLocationName}
                    searchFilterFunction={searchLocations}
                    autoFocus
                  />
                  <StaticInput className='text-capitalize' label='To Location' value={shipment.to} />
                  <VendorIdInput
                    value={shipment.vendorId}
                    valueUpdated={updateShipment}
                  />
                </fieldset>
              </form>
              <br />
              <div className='row'>
                <div className='col-sm-10'>
                  <button onClick={this.toggleShowEditDetails} className='btn btn-primary'>Save Details</button>
                </div>
              </div>
            </div>
          ) : (
            <StaticShipmentDetails shipment={shipment}>
              <a onClick={this.toggleShowEditDetails}>edit details</a>
            </StaticShipmentDetails>
          )}

          {this.state.showEditTransactions && (
            <div>
              <br />
              <SearchDrop
                rows={items.items}
                loading={items.firstRequest}
                value={{}}
                valueSelected={this.toggleNewBatch}
                onNewSelected={this.toggleNewItem}
                label={'Search Items'}
                resourceName={'Item'}
                displayFunction={displayItemName}
                searchFilterFunction={searchItems}
                autoFocus={isNew}
              />
              <EditTransactionsTable
                transactions={shipment.transactions}
                onEditClick={this.transactionEditClick}
              />
            </div>
          )}

          {this.state.showNewLocation && (
            <NewLocation
              value={this.state.newLocationName}
              valueKey={'from'}
              valueUpdated={updateShipment}
              closeClicked={this.toggleNewReceiveLocation}
            />)}

          {this.state.showBatchEdit && (
            <EditBatch
              item={this.state.editingItem}
              category={this.state.editingCategory}
              batch={this.state.editingBatch}
              valueUpdated={this.updateTransaction}
              deleteClicked={this.deleteTransaction}
              closeClicked={this.hideEditBatch}
            />)}
        {!isNew && (
            <div>
              <ShipmentLink
                dbName={dbName}
                id={shipment._id}
                className='btn btn-primary'
                shipmentType='receive'>
                Done
              </ShipmentLink>
              <button onClick={this.toggleDeleteModal} className='btn btn-default pull-right'>delete</button>
            </div>
          )}
        {this.state.showDeleteModal && (
          <DeleteShipmentModal
            onConfirm={this.deleteShipment}
            shipmentName={shipmentName}
            onClose={this.toggleDeleteModal}
          />
        )}
        {this.state.showNewItem && (
          <NewItem
            value={this.state.editingItem}
            closeClicked={this.closeNewItem}
            valueUpdated={this.newItemSelected}
            categories={this.props.items.categories}
          />
        )}
        </div>
      )
  }
}

export default connect(
  state => {
    return { editshipment: state.editshipment, user: state.user, locations: state.locations, items: state.items }
  },
  { startNewShipmentAction, updateShipment, getShipment, getItems, getLocations }
)(ReceivePage)
