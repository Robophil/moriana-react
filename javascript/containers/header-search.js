import React from 'react'
import { connect } from 'react-redux'
import { getItems, stockCardLink } from 'items'
import { getLocations } from 'locations'
import h from 'helpers'
import StockcardLink from 'stockcard-link'

const HeaderSearch = class extends React.Component {
  state = { limit: 50, openButton: 'items', query: '', currIndex: 0, itemResults: [] }

  componentDidMount = () => {
    this.props.getItems(this.props.dbName, this.props.currentLocationName)
    this.props.getLocations(this.props.dbName, this.props.currentLocationName)
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      itemResults: newProps.items.items.slice(0, this.state.limit)
    })
  }

  runSearch = (e) => {
    const query = e.currentTarget.value
    const cleanedQuery = query.toLowerCase().trim()
    const itemResults = this.props.items.items.filter(item =>
      item.item.toLowerCase().indexOf(cleanedQuery) !== -1 ||
      item.category.toLowerCase().indexOf(cleanedQuery) !== -1
    )
    this.setState({ query, itemResults, currIndex: 0 })
  }

  checkKeys = (e) => {
    switch (h.keyMap(e.keyCode)) {
      case 'ENTER': {
        const item = this.state.itemResults[this.state.currIndex]
        window.location.href = stockCardLink(this.props.dbName, item)
        this.props.closeClicked()
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
      case 'ARROW_DOWN': {
        if (this.state.currIndex === (this.state.itemResults.length - 1)) {
          this.setState({ currIndex: 0 })
        } else {
          this.setState({ currIndex: this.state.currIndex + 1 })
        }
        break
      }
      case 'ARROW_UP': {
        if (this.state.currIndex < 0) {
          this.setState({ currIndex: this.state.itemResults.length - 1 })
        } else {
          this.setState({ currIndex: this.state.currIndex - 1 })
        }
        break
      }
    }
  }

  setCurrIndex = (e) => {
    this.setState({ currIndex: Number(e.target.dataset.index) })
  }

  render () {
    const { dbName } = this.props
    const { loading, items } = this.props.items
    const { query, itemResults, currIndex } = this.state
    return (
      <div className='header-search'>
        {items.length === 0 && loading ? (
          <div className='loader' />
        ) : (
          <div className='search-view-container'>
            <h5>Search<button onClick={this.props.closeClicked} className='close'><span>×</span></button></h5>
            <input type='text' autoFocus ref='query' value={query} onKeyUp={this.checkKeys} onChange={this.runSearch} />
            <div>
              <button className='button-primary' data-search-field='items'>Search Items</button>
              <button data-search-field='locations'>Search Locations</button>
            </div>
            <div className='search-drop'>
              {itemResults.map((item, i) => (
                <StockcardLink
                  className={`${currIndex === i ? 'active' : ''}`}
                  key={i}
                  dbName={dbName}
                  transaction={item}
                  onClick={this.props.closeClicked}
                  onMouseEnter={this.setCurrIndex}
                  dataIndex={i}
                  >
                  {item.item} {item.category}
                </StockcardLink>
              ))}
              <p>
                items: {query ? `${query} found ` : ''} {itemResults.length} of {h.num(items.length)}
              </p>
            </div>
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
