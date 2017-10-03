import React from 'react'
import PropTypes from 'prop-types'
import { searchLocations } from 'locations'
import DateInput from 'date-input'
import SearchDrop from 'search-drop'
import VendorIdInput from 'vendor-id-input'
import NewLocation from 'new-location'
import StaticInput from 'static-input'
import displayPatient from 'display-patient'
import displayLocation from 'display-location'

export default class EditShipmentDetails extends React.Component {
  state = {
    showNewLocation: false,
    newLocationName: '',
  }

  componentDidMount = () => {
    const targetNameSet = this.props.type === 'receive' ? this.props.shipment.from : this.props.shipment.to
    if (targetNameSet) {
      this.setState({ showNewLocation: false })
    }
  }

  locationSelected = (value) => {
    const fromOrTo = this.props.shipmentType === 'receive' ? 'from' : 'to'
    this.props.updateShipment(fromOrTo, value)
  }

  toggleNewReceiveLocation = (inputValue) => {
    this.setState({ showNewLocation: !this.state.showNewLocation, newLocationName: inputValue })
  }

  render () {
    const { onDone, shipment, updateShipment, locations, shipmentType } = this.props
    let detailsElement
    if (shipmentType === 'receive') {
      const shipmentFromValue = {name: shipment.from, type: shipment.fromType, attributes: shipment.fromAttributes}
      detailsElement = (
        <span>
          <SearchDrop
            rows={locations.externalLocations}
            loading={locations.loading}
            value={shipmentFromValue}
            valueSelected={this.locationSelected}
            onNewSelected={this.toggleNewReceiveLocation}
            label={'From Location'}
            resourceName={'Location'}
            displayFunction={displayLocation}
            searchFilterFunction={searchLocations}
            autoFocus
          />
          <StaticInput className='text-capitalize' label='To Location' value={shipment.to} />
          <VendorIdInput
            value={shipment.vendorId}
            valueUpdated={updateShipment}
          />
        </span>
      )
    } else {
      const shipmentToValue = {name: shipment.to, type: shipment.toType, attributes: shipment.toAttributes}
      let targetLocations
      let resourceName
      let label
      let displayFunction
      if (shipmentType === 'dispense') {
        targetLocations = locations.patients
        resourceName = 'Patient'
        label = 'Patient'
        displayFunction = displayPatient
        Object.assign(shipmentToValue, shipment.patient)
      } else {
        targetLocations = shipmentType === 'transfer' ? locations.roles : locations.externalLocations
        resourceName = 'Location'
        label = 'To Location'
        displayFunction = displayLocation
      }
      detailsElement = (
        <span>
          <StaticInput className='text-capitalize' label='From Location' value={shipment.from} />
          <SearchDrop
            rows={targetLocations}
            loading={locations.loading}
            value={shipmentToValue}
            valueSelected={this.locationSelected}
            label={label}
            resourceName={resourceName}
            displayFunction={displayFunction}
            searchFilterFunction={searchLocations}
            autoFocus
          />
        </span>
      )
    }
    return (
      <div className='edit-details'>
        <form onSubmit={onDone}>
          <DateInput
            value={shipment.date}
            valueUpdated={updateShipment}
          />
          {detailsElement}
        </form>
        <button className='save-details' onClick={onDone}>Save Details</button>
        {this.state.showNewLocation && (
          <NewLocation
            value={this.state.newLocationName}
            valueKey={'from'}
            valueUpdated={updateShipment}
            closeClicked={this.toggleNewReceiveLocation}
          />)}
      </div>
    )
  }
}

EditShipmentDetails.propTypes = {
  onDone: PropTypes.func.isRequired,
  updateShipment: PropTypes.func.isRequired,
  shipment: PropTypes.object.isRequired,
  locations: PropTypes.object.isRequired,
  shipmentType: PropTypes.string.isRequired
}
