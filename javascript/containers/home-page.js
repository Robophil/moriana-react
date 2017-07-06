import React from 'react'
import { connect } from 'react-redux'
import {getShipments} from 'shipments'
import ShipmentsTable from 'shipments-table'
import Pagination from 'pagination'
import { withRouter } from 'react-router'

const HomePage = class extends React.Component {
  limit =  500
  componentDidMount = () => {
    const {dbName, offset} = this.props.match.params
    this.props.getShipments(dbName, offset, this.limit)
  }

  fetchShipments = (offset) => {
    const { dbName } = this.props.match.params
    this.props.getShipments(dbName, offset, this.limit)
  }

  render () {
    let { dbName, offset } = this.props.match.params
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

            <Pagination
              offset={offset}
              count={this.props.shipmentsCount}
              dbName={dbName}
              limit={this.limit}
              onClick={this.fetchShipments}
              displayedCount={this.props.rows.length} />
            <ShipmentsTable dbName={dbName} shipments={this.props.rows} />
          </div>
        )}
      </div>
    )
  }
}

export default withRouter(connect(
  state => state.shipments,
  { getShipments }
)(HomePage))
