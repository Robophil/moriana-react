import React from 'react'
import { connect } from 'react-redux'

import {getShipments, filterShipmentsByLocation} from 'store/shipments'
import ShipmentsTable from 'components/shipments-table'
import download from 'utils/download'
import {shipmentsDownloadHeaders} from 'containers/shipments-page'

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
      shipmentsAtThisLocation: filterShipmentsByLocation(newProps.shipments, location),
    })
  }

  downloadShipments = (event) => {
    event.preventDefault()
    const { currentLocationName } = this.props.route
    const { location } = this.props.route.params
    const { shipmentsAtThisLocation, pageName } = this.state
    // headers difference from shipments page: value vs totalValue
    const headers = [
      { name: 'Shipment Date', key: 'date' },
      { name: 'From', key: 'from' },
      { name: 'To', key: 'to' },
      { name: 'Transactions', key: 'totalTransactions' },
      { name: 'Value', key: 'value' },
      { name: 'Last Edited', key: 'updated' },
      { name: 'Creator', key: 'username' },
    ]
    download(shipmentsAtThisLocation, headers, pageName)
  }

  render () {
    const { loading, route, shipments } = this.props
    const { dbName, params } = route
    const {offset} = params
    const { loadingAllShipments, shipmentsAtThisLocation, pageName } = this.state
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
              </div>
            </div>
            <ShipmentsTable dbName={dbName} shipments={shipmentsAtThisLocation} />
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
