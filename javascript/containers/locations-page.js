import React from 'react'
import { connect } from 'react-redux'
import {getShipments, getShipmentsByLocation} from 'shipments'
import {fetchAllShipments} from 'reports'
import ShipmentsTable from 'shipments-table'
import Pagination from 'pagination'
import download from 'download'

export class LocationsPage extends React.Component {
  state = { pageName: '', shipmentsAtThisLocation: [] }

  componentDidMount = () => {
    const { dbName, params, currentLocationName } = this.props.route
    const {location} = params
    this.setState({
      pageName: `${currentLocationName}: Shipments from or to ${location}`
    })
    if (dbName) this.props.getShipments(dbName)
  }

  componentWillReceiveProps = (newProps) => {
    const {location} = this.props.route.params
    this.setState({
      shipmentsAtThisLocation: getShipmentsByLocation(newProps.shipments, location),
    })
  }

  downloadShipments = (event) => {
    event.preventDefault()
    const {currentLocationName} = this.props.route
    const {location} = this.props.route.params
    const headers = [
      { name: 'Shipment Date', key: 'date' },
      { name: 'From', key: 'from' },
      { name: 'To', key: 'to' },
      { name: 'Transactions', key: 'totalTransactions' },
      { name: 'Value', key: 'totalValue' },
      { name: 'Last Edited', key: 'updated' },
      { name: 'Creator', key: 'username' },
    ]
    download(shipments, headers, this.state.name)
  }

  render () {
    const { loading, route, shipments } = this.props
    const { dbName, params } = route
    const {offset} = params
    const { loadingAllShipments, shipmentsAtThisLocation, pageName } = this.state
    const pagination = (<Pagination
      offset={offset}
      count={this.props.shipmentsCount}
      dbName={dbName}
      limit={this.state.limit}
      displayedCount={shipments.length}
    />)
    return (
      <div className='shipments-page'>
        {(loading || loadingAllShipments) ? (
          <div className='loader' />
        ) : dbName ? (
          <div>
            <div className='shipments-header'>
              <h5>{pageName}</h5>
              <div>
                <a href={`/#d/${dbName}/`}>Back to all shipments</a>
              </div>
              <div className='pull-right'>
                <a href='#' onClick={this.downloadShipments} >Download</a>
                {pagination}
              </div>
            </div>
            <ShipmentsTable dbName={dbName} shipments={shipmentsAtThisLocation} />
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
)(LocationsPage)
