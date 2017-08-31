import React from 'react'
import PropTypes from 'prop-types'

const EditReceiveDetails = (props) => {
  return (
    <form className='form-horizontal edit-details-form'>
      <fieldset>
        {/* <DateInput
          value={shipment.date}
          valueUpdated={updateShipment}
        />
        <SearchDrop
          rows={locations.externalLocations}
          loading={locations.firstRequest}
          value={shipmentFromValue}
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
        /> */}
      </fieldset>
    </form>
  )
}

export default class EditShipmentDetails extends React.Component {
  render () {
    const { onDone } = this.props
    return (
      <div> Edit details
        <div>
          <EditReceiveDetails stuff='tings' />
          <br />
          <div className='row'>
            <div className='col-sm-10'>
              <button onClick={onDone} className='btn btn-primary'>Save Details</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

EditShipmentDetails.propTypes = {
  // value: PropTypes.string,
  onDone: PropTypes.func.isRequired
}
