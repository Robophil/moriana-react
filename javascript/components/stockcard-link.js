import React from 'react'
import {stockCardLink} from 'items'

export default class extends React.Component {
  render () {
    const {dbName, transaction} = this.props
    return (<a
      className={this.props.className}
      onMouseEnter={this.props.onMouseEnter}
      data-index={this.props.dataIndex}
      onClick={this.props.onClick}
      href={stockCardLink(dbName, transaction, this.props.atBatch)}>
      {this.props.children}
    </a>)
  }
}
