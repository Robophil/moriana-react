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
    if (newProps.currentShipment && newProps.type) {
      // change the hash & fire the hashchange event so the router catches it, but don't replace state in history
      // with edit-generic hash
      const newHash = window.location.hash.replace('edit-generic', `edit/${newProps.type}`)
      window.history.replaceState(undefined, undefined, newHash)
      window.dispatchEvent(new Event('hashchange'))
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
