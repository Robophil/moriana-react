import React from 'react'
import { connect } from 'react-redux'
import {getShipments} from 'shipments'
import {fetchAllShipments} from 'alldocs'
import ShipmentsTable from 'shipments-table'
import Pagination from 'pagination'
import download from 'download'

export class ShipmentsPage extends React.Component {
  state = { limit: 100, loadingAllShipments: false }
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const {offset} = params
    if (dbName) this.props.getShipments(dbName, offset, this.state.limit)
  }

  downloadShipments = (event) => {
    event.preventDefault()
    this.setState({ loadingAllShipments: true })
    const { dbName, currentLocationName } = this.props.route
    const fileName = 'Shipments at: ' + currentLocationName
    fetchAllShipments(dbName).then((shipments) => {
      this.setState({ loadingAllShipments: false })
      const headers = [
        { name: 'Shipment Date', key: 'date' },
        { name: 'From', key: 'from' },
        { name: 'To', key: 'to' },
        { name: 'Transactions', key: 'totalTransactions' },
        { name: 'Value', key: 'totalValue' },
        { name: 'Last Edited', key: 'updated' },
        { name: 'Creator', key: 'username' },
      ]
      download(shipments, headers, fileName)
    })
  }

  render () {
    const { loading, route, shipments } = this.props
    const { dbName, currentLocationName, params } = route
    const {offset} = params
    const { loadingAllShipments } = this.state
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
              <h5>
                Shipments: <span>{currentLocationName}</span>
              </h5>
              <div className='pull-right'>
                <a href='#' onClick={this.downloadShipments} >Download</a>
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
