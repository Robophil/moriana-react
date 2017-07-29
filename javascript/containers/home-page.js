import React from 'react'
import { connect } from 'react-redux'
import {getShipments} from 'shipments'
import ShipmentsTable from 'shipments-table'
import Pagination from 'pagination'

export class HomePage extends React.Component {
  limit =  500
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const {offset} = params
    if (dbName) this.props.getShipments(dbName, offset, this.limit)
  }

  render () {
    const { loading, route, shipments } = this.props
    const { dbName, currentLocationName, params } = route
    const {offset} = params
    return (
      <div className='home-page'>
        {shipments.length === 0 && loading ? (
          <div className='loader' />
        ) :
        dbName ? (
          <div className='shipments'>

           <h5 className='title'>
             <i className='icon mail-solid'></i>
             Shipments: <span className='text-capitalize'>{currentLocationName}</span>
           </h5>

           <button className='download-button btn btn-default btn-md pull-right'>Download</button>

           <Pagination
             offset={offset}
             count={this.props.shipmentsCount}
             dbName={dbName}
             limit={this.limit}
             displayedCount={shipments.length} />

           <ShipmentsTable dbName={dbName} shipments={shipments} />

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
)(HomePage)
