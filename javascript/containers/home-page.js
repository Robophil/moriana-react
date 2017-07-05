import React from 'react'
import { connect } from 'react-redux'
import {getShipments} from 'shipments'
import ShipmentsTable from 'shipments-table'

const HomePage = class extends React.Component {
  componentDidMount = () => {
    this.props.getShipments(this.props.match.params.dbName)
  }

  render () {
    return (
      <div className='home-page'>
        {this.props.loading ? (
          <div className='loader'>
          </div>
        ) : (
          <div className='shipments'>
            <h5 className='title'>
              <i className='icon mail-solid'></i>
              Shipments: <span className='text-capitalize'>test warehouse</span>
            </h5>
            <button className='download-button btn btn-default btn-md pull-right'>Download</button>

            <div className='pull-right pagination'>
              <div className='pagination'>
                <ul className='pagination pagination-sm'>
                  <li className='disabled previous'><a href='javascript:void(0)'>«</a></li>
                  <li><a className='darker trigger-page' data-offset='0' href='https://lesotho.pih-emr.org:8999/#d/moriana_test_warehouse/0'>1 - 25 of 25</a></li>
                  <li className='disabled next'><a href='javascript:void(0)'>»</a></li>
                </ul>
              </div>
            </div>
            <ShipmentsTable dbName={this.props.match.params.dbName} shipments={this.props.rows} />
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  { getShipments }
)(HomePage)
