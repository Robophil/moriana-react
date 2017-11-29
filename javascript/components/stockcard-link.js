import React from 'react'

export default class extends React.Component {
  render () {
    const {dbName, transaction} = this.props
    return (<a
      className={this.props.className}
      onMouseEnter={this.props.onMouseEnter}
      data-index={this.props.dataIndex}
      onClick={this.props.onClick}
      href={buildStockCardHref(dbName, transaction, this.props.atBatch)}>
      {this.props.children}
    </a>)
  }
}

export const buildStockCardHref = (dbName, transaction, atBatch = false) => {
  const { item, category } = transaction
  let link = `#d/${dbName}/stockcard/${encodeURIComponent(category)}/${encodeURIComponent(item)}/`
  if (atBatch) {
    let { expiration, lot } = transaction
    expiration = expiration === null ? '' : expiration
    lot = lot === null ? '' : lot
    link += `${expiration}__${lot}/`
  }
  return link
}
