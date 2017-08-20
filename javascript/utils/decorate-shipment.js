import h from 'helpers'

export default {
  decorate (ship, currentLocation) {
    // ship.isNew = type ? true : false
    ship.type = this.getType(ship, currentLocation)
    ship.prettyType = ship.type.split('-').join(' ')
    ship.prettyName = `${ship.from} to ${ship.to} on ${h.formatDate(ship.date)}`
    ship.isReceiveFromInternal = this.isReceiveFromInternal(ship, currentLocation)
    return ship
  },

  getType (ship, currentLocation) {
    if (ship.from === currentLocation) {
      if (ship.toType === 'I') return 'transfer'
      if (ship.toType === 'P') return 'dispense'
      return 'transfer-out'
    } else if (ship.fromType === 'I') {
      return 'transfer'
    } else {
      return 'receive'
    }
  },

  // if an internal transfer to this location, don't allow edit
  isReceiveFromInternal (ship, currentLocation) {
    return ship.type === 'transfer' && ship.to &&
      ship.to.toLowerCase() === currentLocation
  }
}
