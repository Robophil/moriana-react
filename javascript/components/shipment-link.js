import React from 'react'
import PropTypes from 'prop-types'

export const buildHref = (id, dbName, details='') => {
  return `/#d/${dbName}/shipment/${details}${id}`
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

ShipmentLink.propTypes = {
  dbName: PropTypes.string.isRequired,
  id: PropTypes.string,
  linkType: PropTypes.string,
  shipmentType:  PropTypes.string
}
