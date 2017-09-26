import React from 'react'
import { connect } from 'react-redux'
import {getShipments} from 'shipments'
import ShipmentsTable from 'shipments-table'
import Pagination from 'pagination'

export class ShipmentsPage extends React.Component {
  state = { limit: 100 }
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const {offset} = params
    if (dbName) this.props.getShipments(dbName, offset, this.state.limit)
  }

  render () {
    const { loading, route, shipments } = this.props
    const { dbName, currentLocationName, params } = route
    const {offset} = params
    const pagination = (<Pagination
      offset={offset}
      count={this.props.shipmentsCount}
      dbName={dbName}
      limit={this.state.limit}
      displayedCount={shipments.length}
    />)
    return (
      <div className='shipments-page'>
        {loading ? (
          <div className='loader' />
        ) : dbName ? (
          <div>
            <div className='shipments-header'>
              <h5>
                {/* <i className='icon mail-solid' /> */}
                Shipments: <span>{currentLocationName}</span>
              </h5>
              <div className='pull-right'>
                <a href='#' >Download</a>
                {pagination}
              </div>
            </div>
            <ShipmentsTable dbName={dbName} shipments={shipments} />
            <div className='pull-right'>
              {pagination}
            </div>
          </div>
        ) : (<div />)
      }
      </div>
    )
  }
}

export default connect(
  state => state.shipments,
  { getShipments }
)(ShipmentsPage)
