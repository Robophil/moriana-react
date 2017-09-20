import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import { updateShipment, startNewShipmentAction } from 'editshipment'
import { getStockForEdit } from 'stock'
import { getLocations } from 'locations'
import { getItems } from 'items'
import { showNote } from 'notifications'
import ShipmentLink from 'shipment-link'
import DeleteShipmentModal from 'delete-shipment-modal'
import StaticShipmentDetails from 'static-shipment-details'
import EditShipmentDetails from 'edit-shipment-details'
import EditTransactions from 'edit-transactions'
import h from 'helpers'

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

  componentWillReceiveProps = (newProps) => {
    const {shipment, isNew} = newProps.editshipment
    const {currentLocationName, dbName} = this.props.route
    // if (shipment.from) {
    //   this.setState({ showNewLocation: false })
    // }
    if (!this.props.route.params.id && this.props.editshipment.isNew && !isNew) {
      const newHash = window.location.hash + '/' + shipment._id
      window.history.replaceState(undefined, undefined, newHash)
    }
    if (!this.props.editshipment.savingShipment && newProps.editshipment.savingShipment) {
      const savingOrDeleting = newProps.editshipment.deleted ? 'Deleting' : 'Saving'
      this.props.showNote(`${savingOrDeleting} shipment at ${currentLocationName}`)
    } else if (this.props.editshipment.savingShipment && !newProps.editshipment.savingShipment) {
      const {deleted} = this.props.editshipment
      const savedOrDeleted = deleted ? 'deleted' : 'saved'
      this.props.showNote(`Shipment ${savedOrDeleted} at ${currentLocationName}`)
      if (deleted) {
        setTimeout(() => {
          window.location.href = `/#d/${dbName}`
        }, 500)
      }
    }
  }

  toggleDetails = () => {
    const {from, to, date} = this.props.editshipment.shipment
    if (from && to && date) {
      this.setState({ showEditDetails: !this.state.showEditDetails, showEditTransactions: true })
    }
  }

  toggleDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
  }

  deleteShipment = () => {
    this.props.updateShipment('delete')
  }

  render () {
    const { showEditDetails } = this.state
    const { locations, items, updateShipment, route } = this.props
    const { shipment, loadingInitialShipment, isNew, shipmentName, apiError } = this.props.editshipment
    const { dbName, currentLocationName } = route
    const shipmentType = route.params.shipmentType

    if (apiError) {
      return (
        <div className='alert alert-warning text-center'>
          This shipment does not exist at this location. <a href={`/#d/${dbName}/`}>back</a> <br />
          Details: {h.json(apiError)}
        </div>
      )
    } else if (loadingInitialShipment) {
      return (<div className='loader' />)
    }

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
        {this.state.showEditTransactions && (
          <EditTransactions
            dbName={dbName}
            currentLocationName={currentLocationName}
            shipmentType={shipmentType}
            items={items.items}
            categories={items.categories}
            itemsLoading={items.firstRequest}
            updateShipment={updateShipment}
            transactions={shipment.transactions}
            getStockForEdit={this.props.getStockForEdit}
            date={shipment.date}
            stock={this.props.stock.transactions}
          />
        )}
        {!isNew && (
          <div>
            <ShipmentLink
              dbName={dbName}
              id={shipment._id}
              className='btn btn-primary'
              shipmentType='receive'>
              Done
            </ShipmentLink>
            <button onClick={this.toggleDeleteModal} className='btn btn-default pull-right'>delete</button>
          </div>
        )}
        {this.state.showDeleteModal && (
          <DeleteShipmentModal
            onConfirm={this.deleteShipment}
            shipmentName={shipmentName}
            onClose={this.toggleDeleteModal}
          />
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
      items: state.items,
      stock: state.stock
    }
  },
  {
    startNewShipmentAction,
    updateShipment,
    getShipment,
    getItems,
    getLocations,
    showNote,
    getStockForEdit
  }
)(EditShipmentPage)
