import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'
import { startNewShipmentAction } from 'editshipment'
import { updateShipment } from 'update-shipment'
import { getStockForEdit } from 'stock'
import { getLocations } from 'locations'
import { getItems, addItem } from 'items'
import { showNote } from 'notifications'
import ShipmentLink from 'shipment-link'
import DeleteShipmentModal from 'delete-shipment-modal'
import StaticShipmentDetails from 'static-shipment-details'
import EditShipmentDetails from 'edit-shipment-details'
import EditReceiveBatch from 'edit-receive-batch'
import EditTransferBatch from 'edit-transfer-batch'
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

  componentWillReceiveProps = (newProps) => {
    const { isNew, deleted, savingShipment } = this.props.editshipment
    if (isNew && !newProps.editshipment.isNew && !this.props.route.params.id) {
      const newHash = window.location.hash + '/' + newProps.editshipment.shipment._id
      window.history.replaceState(undefined, undefined, newHash)
    }
    if (deleted && savingShipment && !newProps.editshipment.savingShipment) {
      setTimeout(() => {
        window.location.href = `/#d/${this.props.route.dbName}`
      }, 500)
    }
  }

  toggleDetails = (event) => {
    if (event) event.preventDefault()
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

  getStockOnItem = (item, category) => {
    const { dbName, currentLocationName } = this.props.route
    const { date } = this.props.editshipment.shipment
    this.props.getStockForEdit(dbName, currentLocationName, date, category, item)
  }

  render () {
    const { showEditDetails } = this.state
    const { locations, items, updateShipment, route, addItem } = this.props
    const { shipment, loadingInitialShipment, isNew, shipmentName, apiError } = this.props.editshipment
    const { dbName, currentLocationName } = route
    const shipmentType = this.props.editshipment.shipmentType || route.params.shipmentType

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

    let editBatch
    if (shipmentType === 'receive') {
      editBatch = (
        <EditReceiveBatch
          items={items.items}
          categories={items.categories}
          itemsLoading={items.firstRequest}
          updateShipment={updateShipment}
          transactions={shipment.transactions}
          addItem={addItem}
        />
      )
    } else {
      editBatch = (
        <EditTransferBatch
          dbName={dbName}
          currentLocationName={currentLocationName}
          shipmentType={shipmentType}
          items={items.items}
          categories={items.categories}
          itemsLoading={items.firstRequest}
          updateShipment={updateShipment}
          transactions={shipment.transactions}
          getStockOnItem={this.getStockOnItem}
          date={shipment.date}
          itemStock={this.props.stock.batches}
          itemStockLoading={this.props.stock.loading}
        />
      )
    }

    return (
      <div className='edit-page'>
        <h5 className='text-capitalize'>
          {shipment.from
            ? (<span>{shipmentType}: {shipment.from} to {shipment.to}</span>)
            : (<span>Create {shipmentType}</span>)
          }
          {!isNew && (<button onClick={this.toggleDeleteModal} className='pull-right button-small'>
            delete shipment
          </button>)}
        </h5>
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
        {this.state.showEditTransactions && editBatch}
        {!isNew && (
          <div className='footer-link'>
            <ShipmentLink
              dbName={dbName}
              id={shipment._id}
              shipmentType='receive'>
              Done editing shipment
            </ShipmentLink>
          </div>
        )}
        {this.state.showDeleteModal && !this.props.editshipment.deleted && (
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
    addItem,
    getLocations,
    showNote,
    getStockForEdit
  }
)(EditShipmentPage)
