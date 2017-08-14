import React from 'react'
import { connect } from 'react-redux'
import {getShipment} from 'shipments'
import { updateShipment, startNewShipment } from 'editshipment'
import {displayLocationName, searchLocations} from 'locations'
import {displayItemName, searchItems} from 'items'
import DateInput from 'date-input'
import SearchDrop from 'search-drop'
import VendorIdInput from 'vendor-id-input'
import NewLocation from 'new-location'
import EditBatch from 'edit-batch'
import StaticShipmentDetails from 'static-shipment-details'
import EditTransactionsTable from 'edit-transactions-table'
import StaticInput from 'static-input'

const ReceivePage = class extends React.Component {
  state = {
    isNew: true,
    showNewLocation: false,
    newLocationName: '',
    showEditDetails: true,
    showEditTransactions: false,
    showBatchEdit: false,
    editingItem: '',
    editingCategory: ''
  }

  componentDidMount = () => {
    const { dbName, params } = this.props.route
    if (params.id) {
      this.setState({ isNew: false, showEditDetails: false, showEditTransactions: true })
      this.props.getShipment(dbName, params.id)
    } else {
      this.props.startNewShipment(this.props.route.currentLocationName, 'receive')
    }
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.editshipment.shipment.from) {
      this.setState({ showNewLocation: false })
    }
  }

  toggleShowEditDetails = () => {
    this.setState({ showEditDetails: !this.state.showEditDetails, showEditTransactions: true })
  }

  toggleNewReceiveLocation = (inputValue) => {
    this.setState({ showNewLocation: !this.state.showNewLocation, newLocationName: inputValue })
  }

  transactionEditClick = (index) => {
    console.log(index)
  }

  toggleNewBatch = (key, value) => {
    this.setState({ editingItem: value.item, editingCategory: value.category, showBatchEdit: true })
  }

  hideEditBatch = () => {
    this.setState({ editingItem: null, editingCategory: null, showBatchEdit: false })
  }

  toggleNewItem = (name) => {
    console.log('new item')
  }

  render () {
    const { shipment, loadingInitialShipment, dateError } = this.props.editshipment
    const { locations } = this.props
    // console.log(JSON.stringify(shipment, null, 2))
    return loadingInitialShipment ? (
      <div className='loader' />
      ) : (
        <div>
          <h5 className='text-capitalize title'>
            {/* <i className='icon arrow-down'></i> */}
            {shipment.from ? (<span>Receive: {shipment.from} to {shipment.to}</span>) : (<span>Create receive</span>)}
          </h5>
          <hr />
          {this.state.showEditDetails ? (
            <div>
              <form className='form-horizontal edit-details-form'>
                <fieldset>
                  <DateInput
                    valueKey={'date'}
                    error={dateError}
                    value={shipment.date}
                    valueUpdated={this.props.updateShipment}
                  />
                  <SearchDrop
                    rows={locations.externalLocations}
                    loading={locations.loading}
                    value={{name: shipment.from, type: shipment.fromType, attributes: shipment.fromAttributes}}
                    valueKey={'from'}
                    valueUpdated={this.props.updateShipment}
                    onNewSelected={this.toggleNewReceiveLocation}
                    label={'From Location'}
                    resourceName={'Location'}
                    displayFunction={displayLocationName}
                    searchFilterFunction={searchLocations}
                  />
                  <StaticInput className='text-capitalize' label='To Location' value={shipment.to} />
                  <VendorIdInput
                    valueKey={'vendorId'}
                    value={shipment.vendorId}
                    valueUpdated={this.props.updateShipment}
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
              <SearchDrop
                rows={this.props.items.items}
                loading={this.props.items.loading}
                value={{}}
                valueKey={'receive_transaction'}
                valueUpdated={this.toggleNewBatch}
                onNewSelected={this.toggleNewItem}
                label={'Search Items'}
                resourceName={'Item'}
                displayFunction={displayItemName}
                searchFilterFunction={searchItems}
              />
              <EditTransactionsTable transactions={shipment.transactions} onEditClick={this.transactionEditClick} />
            </div>
          )}

          {this.state.showNewLocation && (
            <NewLocation
              value={this.state.newLocationName}
              valueKey={'from'}
              valueUpdated={this.props.updateShipment}
              closeClicked={this.toggleNewReceiveLocation}
            />)}

          {this.state.showBatchEdit && (
            <EditBatch
              item={this.state.editingItem}
              category={this.state.editingCategory}
              valueUpdated={this.props.updateShipment}
              closeClicked={this.hideEditBatch}
            />)}

        </div>
      )
  }
}

export default connect(
  state => {
    return { editshipment: state.editshipment, user: state.user, locations: state.locations, items: state.items }
  },
  { startNewShipment, updateShipment, getShipment }
)(ReceivePage)
