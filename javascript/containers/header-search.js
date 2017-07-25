import React from 'react'
import { connect } from 'react-redux'
import { getItems } from 'items'
import h from 'helpers'
import StockcardLink from 'stockcard-link'

const HeaderSearch = class extends React.Component {
  state = { limit: 50, openButton: 'items', query: '', currIndex: 0, results: [] }

  componentDidMount = () => {
    this.props.getItems(this.props.dbName, this.props.currentLocationName)
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      results: newProps.rows.slice(0, this.state.limit)
    });
  }

  runSearch = (e) => {
    const query = e.currentTarget.value
    const cleanedQuery = query.toLowerCase().trim()
    const results = this.props.rows.filter(item =>
      item.item.toLowerCase().indexOf(cleanedQuery) != -1
      || item.category.toLowerCase().indexOf(cleanedQuery) != -1
    )
    this.setState({ query, results, currIndex: 0 })
  }

  checkKeys = (e) => {
    switch (h.keyMap(e.keyCode)) {
      case 'ENTER': {
        const item = this.state.results[this.state.currIndex]
        window.location.href = h.stockCardLink(this.props.dbName, item.category, item.item)
        this.props.closeClicked()
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
      case 'ARROW_DOWN': {
        if (this.state.currIndex === (this.state.results.length - 1)) {
          this.setState({ currIndex: 0 })
        } else {
          this.setState({ currIndex: this.state.currIndex + 1 })
        }
        break
      }
      case 'ARROW_UP': {
        if (this.state.currIndex < 0) {
          this.setState({ currIndex: this.state.results.length - 1 })
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
    const { rows, dbName } = this.props
    const { query, results, currIndex } = this.state
    return (
      <div className='search-view'>
        {this.props.loading ? (
          <div className='loader'></div>
        ) : (
          <div className='search-view-container'>
            <h5>Search<button type='button' className='close'><span>×</span></button></h5>
            <hr />
            <input autoFocus className='form-control' ref='query' value={query} onKeyUp={this.checkKeys} onChange={this.runSearch} />
            <div className='btn-group'>
              <button className='btn btn-default btn-primary' data-search-field='items'>Search Items</button>
              <button className='btn btn-default' data-search-field='locations'>Search Locations</button>
            </div>
            <br /><br />
            <div className='results'>
              <div className='list-group'>
                {results.map((item, i) => (
                  <StockcardLink
                    className={`list-group-item result ${currIndex === i ? 'active' : ''}`}
                    key={i} dbName={dbName}
                    item={item.item}
                    onClick={this.props.closeClicked}
                    onMouseEnter={this.setCurrIndex}
                    dataIndex={i}
                    category={item.category}>
                    {item.item} {item.category}
                  </StockcardLink>
                ))}
                <a  href='javascript:void(0)' className='list-group-item result'>
                  items: {query ? `${query} found ` : ''} {results.length} of {h.num(rows.length)}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default connect(
  state => state.items,
  { getItems }
)(HeaderSearch)
