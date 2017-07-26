import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  render () {
    const {dbName, transaction} = this.props
    return (<a
      className={this.props.className}
      onMouseEnter={this.props.onMouseEnter}
      data-index={this.props.dataIndex}
      onClick={this.props.onClick}
      href={h.stockCardLink(dbName, transaction, this.props.atBatch)}>
      {this.props.children}
    </a>)
  }
}
