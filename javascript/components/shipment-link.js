import React from 'react'

export const buildHref = (id, dbName, details='') => {
  return `#d/${dbName}/shipment/${details}${id}`
}

export default class ShipmentLink extends React.Component {
  render () {
    const { linkType, id, shipmentType, dbName, children, className } = this.props
    const classes = className || ''
    let details = ''
    if (linkType) {
      details += linkType + '/'
      if (shipmentType) {
        details += shipmentType + '/'
      }
    }
    const href = buildHref(id, dbName, details)
    return (<a className={classes} href={href}>{children}</a>)
  }
}
