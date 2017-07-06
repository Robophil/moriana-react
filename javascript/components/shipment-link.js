import React from 'react'

export default class extends React.Component {
  render () {
    const type = this.props.type ? this.props.type + '/' : ''
    return (<a href={`/#d/${this.props.dbName}/shipment/${type}${this.props.id}`}>{this.props.children}</a>)
  }
}
