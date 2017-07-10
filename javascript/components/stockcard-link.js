import React from 'react'

export default class extends React.Component {
  render () {
    const {dbName, category, item} = this.props
    return (<a href={`/#d/${dbName}/stockcard/${encodeURIComponent(category)}/${encodeURIComponent(item)}/`}>{this.props.children}</a>)
  }
}
