import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import { updateShipment, startNewShipmentAction } from 'editshipment'
import { displayLocationName, searchLocations, getLocations } from 'locations'
import { displayItemName, searchItems, getItems } from 'items'
import { showNote } from 'notifications'
import DeleteShipmentModal from 'delete-shipment-modal'

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

  render () {
    const { shipmentType, shipment, loadingInitialShipment, isNew, shipmentName } = this.props.editshipment
    const { locations, items, updateShipment, route } = this.props
    const { dbName } = route

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
