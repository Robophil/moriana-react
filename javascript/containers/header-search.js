import React from 'react'
import { connect } from 'react-redux'
import { getItems, searchItems, displayItemName } from 'store/items'
import { getLocations, searchLocations } from 'store/locations'
import h from 'utils/helpers'
import displayLocation from 'components/display-location'
import {buildStockCardHref} from 'components/stockcard-link'
import SearchDrop from 'components/search-drop'

const HeaderSearch = class extends React.Component {
  state = { itemsOpen: true }

  componentDidMount = () => {
    this.props.getItems(this.props.dbName, this.props.currentLocationName)
    this.props.getLocations(this.props.dbName, this.props.currentLocationName)
  }

  itemSelected = (resource) => {
    const {item, category} = resource
    window.location.href = buildStockCardHref(this.props.dbName, {item, category})
    this.props.closeClicked()
  }

  switchSearch = (event) => {
    event.stopPropagation()
    event.preventDefault()
    this.setState({ itemsOpen: !this.state.itemsOpen })
  }

  closeClicked = (event) => {
    this.props.closeClicked()
  }

  locationSelected = (location) => {
    const link = `#d/${this.props.dbName}/locations/${encodeURIComponent(location.name)}/`
    window.location.href = link
    this.props.closeClicked()
  }

  render () {
    const { items } = this.props.items
    const loadingItems = this.props.items.loading
    const { locations } = this.props.locations
    const loadingLocations = this.props.locations.loading
    const { itemsOpen } = this.state
    return (
      <div className='header-search'>
        <button className='close' onClick={this.closeClicked}><span>×</span></button>
        {itemsOpen ? (
          <div>
            <button className='button-primary'>Search Items</button>
            <button onMouseDown={this.switchSearch}>Search Locations</button>
            <SearchDrop
              rows={items}
              loading={loadingItems}
              value={{}}
              valueSelected={this.itemSelected}
              resourceName={'item'}
              displayFunction={displayItemName}
              searchFilterFunction={searchItems}
              stayOpen
              autoFocus
            />
          </div>
        )
        : (
          <div>
            <button onMouseDown={this.switchSearch}>Search Items</button>
            <button className='button-primary'>Search Locations</button>
            <SearchDrop
              rows={locations}
              loading={loadingLocations}
              value={{}}
              valueSelected={this.locationSelected}
              resourceName={'location'}
              displayFunction={displayLocation}
              searchFilterFunction={searchLocations}
              stayOpen
              autoFocus
            />
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      items: state.items,
      locations: state.locations
    }
  },
  { getItems, getLocations }
)(HeaderSearch)
