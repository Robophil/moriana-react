import React from 'react'
import { connect } from 'react-redux'
import { updateShipment, startNewShipment } from 'editreceive'
import h from 'helpers'
import StockcardLink from 'stockcard-link'
import DateInput from 'date-input'
import LocationsSearch from 'locations-search'
import VendorIdInput from 'vendor-id-input'

const EditReceivePage = class extends React.Component {
  componentDidMount = () => {
    this.props.startNewShipment(this.props.dbName, this.props.currentLocationName)
  }

  render () {
    const { shipment, loadingInitialShipment, dateError } = this.props.editReceive
    const { locations } = this.props
    const { dbName } = this.props.route
    console.log(shipment)
    return loadingInitialShipment ? (
        <div className='loader'></div>
      ) : (
        <div>
          <h5 className='text-capitalize title'><i className='icono-plus'></i> Create receive</h5>
          <hr />
          <div className='shipment-details'>
            <div className='edit-shipment-details'>
              {/* <div className='shipment-details'>
                <strong>August 10, 2017</strong> |
                transactions: <strong></strong>
                | total value: <strong>0.0</strong>
                &nbsp; <a href='#' className='toggle-details'>edit details</a>
              </div> */}
              <div>
                <form className='form-horizontal edit-details-form'>
                  <fieldset>
                    <DateInput
                      valueKey={'date'}
                      error={dateError}
                      value={shipment.date}
                      valueUpdated={this.props.updateShipment}
                    />
                    <LocationsSearch
                      locations={locations.externalLocations}
                      loading={locations.loading}
                      value={{name: shipment.from, type: shipment.fromType}}
                      valueKey={'from'}
                      valueUpdated={this.props.updateShipment}
                      label={'From Location'}
                    />
                    <div className='form-group field to-location text-capitalize'>
                      <label className='col-lg-2 control-label'>To Location</label>
                      <div className='col-sm-9 input-group'>
                        <div className='form-control-static '>
                          <span className='static-value'>test warehouse</span>
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
                  <div className='col-sm-10 input-group'>
                    <span className='cancel-button hidden'><button className='toggle-details btn btn-default'>Cancel</button> &nbsp;| </span>
                    <button className='btn btn-primary save-details'>Save Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
  }
}

export default connect(
  state => {
    return { editReceive: state.editreceive, locations: state.locations }
  },
  { startNewShipment, updateShipment }
)(EditReceivePage)