import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  render () {
    const {dbName, category, item} = this.props
    return (<a
      className={this.props.className}
      onClick={this.props.onClick}
      href={h.stockCardLink(dbName, category, item)}>
      {this.props.children}
    </a>)
  }
}
