import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import { updateShipment, startNewShipmentAction } from 'editshipment'
import { getLocations } from 'locations'
import { displayItemName, searchItems, getItems } from 'items'
import { showNote } from 'notifications'
import DeleteShipmentModal from 'delete-shipment-modal'
import StaticShipmentDetails from 'static-shipment-details'
import EditShipmentDetails from 'edit-shipment-details'

const EditShipmentPage = class extends React.Component {
  state = {
    showEditDetails: true,
    showEditTransactions: false,
    showDeleteModal: false
  }

  componentDidMount = () => {
    const { dbName, currentLocationName, params } = this.props.route
    if (params.id) {
      this.setState({ showEditDetails: false, showEditTransactions: true })
      this.props.getShipment(dbName, params.id)
    } else {
      this.props.startNewShipmentAction(currentLocationName, dbName, params.shipmentType)
    }
    this.props.getItems(dbName, currentLocationName)
    this.props.getLocations(dbName, currentLocationName)
  }

  // componentWillReceiveProps = (newProps) => {
  //   if (newProps.currentShipment && newProps.type) {
  //     // change the hash & fire the hashchange event so the router catches it, but don't replace state in history
  //     // with edit/generic hash
  //     const newHash = window.location.hash.replace('edit/generic', `edit/${newProps.type}`)
  //     window.history.replaceState(undefined, undefined, newHash)
  //     // window.dispatchEvent(new Event('hashchange'))
  //   }
  // }

  toggleDetails = () => {
    const {from, to, date} = this.props.editshipment.shipment
    if (from && to && date) {
      this.setState({ showEditDetails: !this.state.showEditDetails, showEditTransactions: true })
    }
  }

  render () {
    const { showEditDetails } = this.state
    const { locations, items, updateShipment, route } = this.props
    const { shipment, loadingInitialShipment, isNew, shipmentName } = this.props.editshipment
    const { dbName } = route
    const shipmentType = route.params.shipmentType

    if (loadingInitialShipment) return (<div className='loader' />)
    return (
      <div className='edit-page'>
        <h5 className='text-capitalize title'>
          {shipment.from
            ? (<span>{shipmentType}: {shipment.from} to {shipment.to}</span>)
            : (<span>Create {shipmentType}</span>)
          }
        </h5>
        <hr />
        {showEditDetails ? (
          <EditShipmentDetails
            onDone={this.toggleDetails}
            locations={locations}
            updateShipment={updateShipment}
            shipment={shipment}
            shipmentType={shipmentType}
          />
        ) : (
          <StaticShipmentDetails shipment={shipment}>
            <a onClick={this.toggleDetails}>edit details</a>
          </StaticShipmentDetails>
        )}
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      editshipment: state.editshipment,
      user: state.user,
      locations: state.locations,
      items: state.items
    }
  },
  {
    startNewShipmentAction,
    updateShipment,
    getShipment,
    getItems,
    getLocations,
    showNote
  }
)(EditShipmentPage)
