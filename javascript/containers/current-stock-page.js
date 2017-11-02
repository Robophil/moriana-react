import React from 'react'
import { connect } from 'react-redux'
import { getItems } from 'items'
import {buildStockCardHref} from 'stockcard-link'
import h from 'helpers'

const CurrentStockPage = class extends React.Component {
  state = { activeFilter: 'all', displayedItems: null }

  componentDidMount = () => {
    const { dbName, currentLocationName, params } = this.props.route
    this.props.getItems(dbName, currentLocationName)
  }

  filterOnClick = (event) => {
    event.preventDefault()
    const {filter} = event.target.dataset
    const {items} = this.props
    let displayedItems
    switch (filter) {
      case 'all':
        displayedItems = items
        break;
      case 'positive':
        displayedItems = items.filter(i => i.value > 0)
        break;
      case 'zero':
        displayedItems = items.filter(i => i.value === 0)
        break;
      case 'quality':
        displayedItems = items.filter(i => i.value < 0)
        break;
    }
    this.setState({ activeFilter: filter, displayedItems })
  }

  stockLinkClicked = (event) => {
    const {item, category} = event.currentTarget.dataset
    window.location.href = buildStockCardHref(this.props.route.dbName, {item, category})
  }

  render () {
    const filters = [
      { name: 'All', key: 'all' },
      { name: 'By Positive', key: 'positive' },
      { name: 'By Zero', key: 'zero' },
      { name: 'By Data Quality', key: 'quality' }
    ]
    const { items, loading } = this.props
    const { currentLocationName } = this.props.route
    let { activeFilter, displayedItems } = this.state
    displayedItems = displayedItems ? displayedItems : items
    if (loading && items.length === 0) return (<div className='loader' />)
    return (
      <div className='current-stock-page'>
        <h5>Current Stock at {currentLocationName}</h5>
        <div className='pull-right'>
          {filters.map((filter, i) => {
            const classes = (filter.key === activeFilter) ? 'disabled-link' : ''
            return (
              <a
                href='#'
                key={i}
                onClick={this.filterOnClick}
                data-filter={filter.key}
                className={classes}>
                  {filter.name}
              </a>
            )
          })}
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Category</th>
              <th>Total Value</th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.map((row, i) => (
              <tr key={i} data-item={row.item} data-category={row.category} onClick={this.stockLinkClicked}>
                <td>{row.item}</td>
                <td>{row.category}</td>
                <td>{h.num(row.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!displayedItems.length && (<div className='text-center'>No items</div>)}
      </div>
    )
  }
}

export default connect(
  state => state.items,
  { getItems }
)(CurrentStockPage)
