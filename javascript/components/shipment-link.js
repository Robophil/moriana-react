import React from 'react'
import { Link } from 'react-router-dom'

export default class extends React.Component {
  render () {
    const type = this.props.type ? this.props.type + '/' : ''
    return (<Link to={`/d/${this.props.dbName}/shipment/${type}${this.props.id}`}>{this.props.children}</Link>)
  }
}
