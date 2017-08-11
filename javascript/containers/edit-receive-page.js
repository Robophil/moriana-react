import React from 'react'
import { connect } from 'react-redux'
import { updateShipment, startNewShipment } from 'editreceive'
import h from 'helpers'
import StockcardLink from 'stockcard-link'
import DateInput from 'date-input'
import VendorIdInput from 'vendor-id-input'

const EditReceivePage = class extends React.Component {
  componentDidMount = () => {
    this.props.startNewShipment(this.props.dbName, this.props.currentLocationName)
  }

  render () {
    const { shipment, loadingInitialShipment, route, dateError } = this.props
    const { dbName } = route
    console.log(shipment)
    return this.props.loadingInitialShipment ? (
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
                    <div className='form-group field from-location text-capitalize editable-location'>
                      <label className='col-lg-2 control-label'>From Location</label>
                      <div className='col-sm-9 input-group'>
                        {/* <div className='form-control-static hidden'>
                          <span className='static-value'></span>
                          (<a href='#' data-fieldname='from-location' className='edit-field text-no-transform'>
                            edit</a>)
                        </div> */}
                        <input className='form-control form-input ' type='text' data-close='true' data-fieldname='from-location' />
                        {/* <p className='error help-block hidden'></p> */}
                        {/* <div className='search-drop form-input hidden'>
                          <div className='list-group'>
                            <a href='#' data-index='0' className='list-group-item result active'>
                              Fake NDSO (external)
                            </a>
                            <a href='#' data-index='1' className='list-group-item result '>
                              Mokotjo Holdings, LLC (external)
                            </a>
                            <a href='#' data-index='2' className='list-group-item result '>
                              New Test Supplier (external)
                            </a>
                            <a href='#' data-index='3' className='list-group-item result '>
                              Test x (external) (excluded from consumption)
                            </a>
                            <a href='#' data-index='4' className='list-group-item result add-new'>
                              External Locations: 4 of 4
                               | <strong>Add New External Location</strong>
                            </a>
                          </div>
                        </div> */}
                      </div>
                    </div>
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
  state => state.editreceive,
  { startNewShipment, updateShipment }
)(EditReceivePage)
