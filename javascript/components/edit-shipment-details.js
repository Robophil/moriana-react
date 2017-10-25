import React from 'react'
import { searchLocations } from 'locations'
import DateInput from 'date-input'
import SearchDrop from 'search-drop'
import VendorIdInput from 'vendor-id-input'
import NewLocation from 'new-location'
import NewPatient from 'new-patient'
import StaticInput from 'static-input'
import displayPatient from 'display-patient'
import displayLocation from 'display-location'

export default class EditShipmentDetails extends React.Component {
  state = {
    showNewLocation: true,
    newLocationName: '',
  }

  componentDidMount = () => {
    const targetNameSet = this.props.type === 'receive' ? this.props.shipment.from : this.props.shipment.to
    if (targetNameSet) {
      this.setState({ showNewLocation: false })
    }
  }

  locationSelected = (value) => {
    let updateValue = 'to'
    if (this.props.shipmentType === 'receive') {
      updateValue = 'from'
    } else if (this.props.shipmentType === 'dispense') {
      updateValue = 'patient'
    }
    this.props.updateShipment(updateValue, value)
  }

  toggleNewReceiveLocation = (inputValue) => {
    this.setState({ showNewLocation: !this.state.showNewLocation, newLocationName: inputValue })
  }

  render () {
    const { onDone, shipment, updateShipment, locations, shipmentType } = this.props
    const shipmentFromValue = {name: shipment.from, type: shipment.fromType, attributes: shipment.fromAttributes}
    const shipmentToValue = {name: shipment.to, type: shipment.toType, attributes: shipment.toAttributes}

    const receiveDetails = (
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

    const transferDetails = (
      <span>
        <StaticInput className='text-capitalize' label='From Location' value={shipment.from} />
        <SearchDrop
          rows={locations.roles}
          loading={locations.loading}
          value={shipmentToValue}
          valueSelected={this.locationSelected}
          label='To Location'
          resourceName='Internal Location'
          displayFunction={displayLocation}
          searchFilterFunction={searchLocations}
          autoFocus
        />
      </span>
    )

    const transferOutDetails = (
      <span>
        <StaticInput className='text-capitalize' label='From Location' value={shipment.from} />
        <SearchDrop
          rows={locations.externalLocations}
          loading={locations.loading}
          value={shipmentToValue}
          valueSelected={this.locationSelected}
          onNewSelected={this.toggleNewReceiveLocation}
          label='To Location'
          resourceName='External Location'
          displayFunction={displayLocation}
          searchFilterFunction={searchLocations}
          autoFocus
        />
      </span>
    )

    // const patientValue = shipment.patient

    const dispenseDetails = (
      <span>
        <StaticInput className='text-capitalize' label='From Location' value={shipment.from} />
        <SearchDrop
          rows={locations.patients}
          loading={locations.loading}
          value={shipment.patient || {}}
          valueSelected={this.locationSelected}
          onNewSelected={this.toggleNewReceiveLocation}
          label='Patient'
          resourceName='Patient'
          displayFunction={displayPatient}
          searchFilterFunction={searchLocations}
          autoFocus
        />
      </span>
    )

    let newLocationElement = shipmentType === 'dispense' ?
      <NewPatient
        value={this.state.newLocationName}
        valueUpdated={updateShipment}
        closeClicked={this.toggleNewReceiveLocation}
        districts={this.props.districts}
        districtsLoading={this.props.districtsLoading}
      />
    : (
      <NewLocation
        value={this.state.newLocationName}
        valueKey={targetFromOrTo}
        valueUpdated={updateShipment}
        closeClicked={this.toggleNewReceiveLocation}
      />)

    let detailsElement
    let targetFromOrTo = 'to'
    if (shipmentType === 'receive') {
      detailsElement = receiveDetails
      targetFromOrTo = 'from'
    } else if (shipmentType === 'transfer') {
      detailsElement = transferDetails
    } else if (shipmentType === 'transfer-out') {
      detailsElement = transferOutDetails
    } else if (shipmentType === 'dispense') {
      detailsElement = dispenseDetails
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
        <button className='save-details' onClick={onDone}>Done</button>
        {this.state.showNewLocation && newLocationElement}
      </div>
    )
  }
}
