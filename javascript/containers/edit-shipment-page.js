import React from 'react'
import { connect } from 'react-redux'
import { getShipment } from 'shipments'

const ShipmentPage = class extends React.Component {
  componentDidMount = () => {
    const { dbName, params } = this.props.route
    const { id } = params
    this.props.getShipment(dbName, id)
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.currentShipment && newProps.currentShipment.prettyType) {
      window.location.hash = window.location.hash.replace('edit-generic', `edit/${newProps.currentShipment.prettyType}`)
    }
  }

  render () {
    return (<div className='loader' />)
  }
}

export default connect(
  state => state.shipments,
  { getShipment }
)(ShipmentPage)
