import React from 'react'
import { connect } from 'react-redux'
import { updateShipment, startNewShipment } from 'editreceive'
import {displayLocationName, searchLocations} from 'locations'
import h from 'helpers'
import StockcardLink from 'stockcard-link'
import DateInput from 'date-input'
import SearchDrop from 'search-drop'
import VendorIdInput from 'vendor-id-input'
import NewLocationModal from 'new-location-modal'
import StaticShipmentDetails from 'static-shipment-details'
import EditTransactionsTable from 'edit-transactions-table'

const ReceivePage = class extends React.Component {
  state = {
    showNewLocation: false,
    newLocationName: '',
    showEditDetails: true,
    showEditTransactions: false,
  }

  componentDidMount = () => {
    this.props.startNewShipment(this.props.route.currentLocationName, 'receive')
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.editReceive.shipment.from) {
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

  render () {
    const { shipment, loadingInitialShipment, dateError } = this.props.editReceive
    const { locations, route } = this.props
    const { dbName } = route
    // console.log(JSON.stringify(shipment, null, 2))
    return loadingInitialShipment ? (
        <div className='loader'></div>
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
                  <div className='form-group field to-location text-capitalize'>
                    <label className='col-lg-2 control-label'>To Location</label>
                    <div className='col-sm-9'>
                      <div className='form-control-static '>
                        <span className='static-value'>{shipment.to}</span>
                      </div>
                    </div>
                  </div>
                  <VendorIdInput
                    valueKey={'vendorId'}
                    value={shipment.vendorId}
                    valueUpdated={this.props.updateShipment}
                  />
                </fieldset>
              </form>
              <br />
              <div className='row'>
                <label className='col-lg-2 control-label'></label>
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
              {/* <SearchDrop
                locations={locations.externalLocations}
                loading={locations.loading}
                value={{name: shipment.from, type: shipment.fromType, attributes: shipment.fromAttributes}}
                valueKey={'from'}
                valueUpdated={this.props.updateShipment}
                onNewSelected={this.toggleNewReceiveLocation}
                label={'From Location'}
              /> */}
              <EditTransactionsTable transactions={shipment.transactions} onEditClick={this.transactionEditClick} />
            </div>
          )}

          {this.state.showNewLocation && (
            <NewLocationModal
              value={this.state.newLocationName}
              valueKey={'from'}
              valueUpdated={this.props.updateShipment}
              closeClicked={this.toggleNewReceiveLocation}
            />)}

        </div>
      )
  }
}

export default connect(
  state => {
    return { editReceive: state.editreceive, user: state.user, locations: state.locations }
  },
  { startNewShipment, updateShipment }
)(ReceivePage)
