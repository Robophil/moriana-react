import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'
import ClickOutHandler from 'react-onclickout'

export default class SearchDrop extends React.Component {
  state = {
    showEdit: false,
    inputValue: '',
    localError: false,
    visibleRows: [],
    currIndex: 0,
    showSearch: false,
  }

  componentDidMount = () => {
    this.setState({ visibleRows: this.props.rows.slice(0, 25) })
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ showEdit: !newProps.value.name })
    if (newProps.rows) {
      this.setState({ visibleRows: newProps.rows.slice(0, 25) })
    }
  }

  displayFunction = (value) => {
    return this.props.displayFunction ? this.props.displayFunction(value) : value.name
  }

  onKeyUp = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.rowSelected(this.state.currIndex)
        break
      }
      case 'ESCAPE': {
        if (this.props.value.name) {
          this.toggleEdit()
        } else {
          this.hideSearch()
        }
        break
      }
      case 'ARROW_DOWN': {
        if (this.state.currIndex === (this.state.visibleRows.length - 1)) {
          this.setState({ currIndex: 0 })
        } else {
          this.setState({ currIndex: this.state.currIndex + 1 })
        }
        break
      }
      case 'ARROW_UP': {
        if (this.state.currIndex < 0) {
          this.setState({ currIndex: this.state.visibleRows.length - 1 })
        } else {
          this.setState({ currIndex: this.state.currIndex - 1 })
        }
        break
      }
      default: {
        this.showSearch()
      }
    }
  }

  onChange = (event) => {
    this.runSearch(event.currentTarget.value)
  }

  runSearch = (inputValue) => {
    const cleanedQuery = inputValue.toLowerCase().trim()
    const visibleRows = this.props.searchFilterFunction(this.props.rows, cleanedQuery)
    this.setState({inputValue, visibleRows, currIndex: 0 })
  }

  setCurrIndex = (event) => {
    this.setState({ currIndex: Number(event.target.dataset.index) })
  }

  toggleEdit = (event) => {
    if (event) event.preventDefault()
    this.setState({ showEdit: !this.state.showEdit, showSearch: !this.state.showSearch })
  }

  showSearch = () => {
    if (!this.state.showSearch) this.setState({ showSearch: true })
    if (this.state.inputValue) {
      this.runSearch(this.state.inputValue)
    }
  }

  hideSearch = () => {
    if (this.state.showSearch) this.setState({ showSearch: false })
  }

  onClick = (event) => {
    this.rowSelected(Number(event.currentTarget.dataset.index))
  }

  rowSelected = (index) => {
    if (index === this.state.visibleRows.length) {
      if (this.props.onNewSelected) {
        this.props.onNewSelected(this.state.inputValue)
        this.hideSearch()
      }
    } else {
      this.props.valueUpdated(this.props.valueKey, this.state.visibleRows[index])
    }
  }

  render () {
    const allowNew = this.props.onNewSelected ? true : false
    const { inputValue, showEdit, currIndex, visibleRows, showSearch } = this.state
    const { value, label, resourceName, rows } = this.props
    return (
      <ClickOutHandler onClickOut={this.hideSearch}>
        <div className='form-group field'>
          <label className='col-lg-2 control-label'>{label}</label>
            {showEdit ? (
              <div className='col-sm-9'>
                <input
                  onBlur={this.onBlur}
                  value={inputValue}
                  onKeyUp={this.onKeyUp}
                  onChange={this.onChange}
                  className='form-control form-input'
                  onFocus={this.showSearch}
                  autoFocus
                  type='text' />
                {showSearch && (
                  <div className='search-drop form-input'>
                    <div className='list-group'>
                      {visibleRows.map((row, i) => (
                        <a
                          data-index={i}
                          className={`list-group-item result ${currIndex === i ? 'active' : ''}`}
                          key={i}
                          onMouseEnter={this.setCurrIndex}
                          onClick={this.onClick}
                        >
                          {this.displayFunction(row)}
                        </a>
                      ))}
                      <a
                        data-index={visibleRows.length}
                        onMouseEnter={this.setCurrIndex}
                        onClick={this.onClick}
                        className={`list-group-item result ${currIndex === visibleRows.length ? 'active' : ''}`}
                      >
                        {resourceName}: {visibleRows.length} of {rows.length}
                        {allowNew && (<strong> | Add New {resourceName}</strong>)}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='col-sm-9'>
                <div className='form-control-static '>
                  <span className='static-value'>{this.displayFunction(value)}</span>
                  &nbsp;(<a onClick={this.toggleEdit}>edit</a>)
                </div>
              </div>
            )}
        </div>
      </ClickOutHandler>
    )
  }
}

SearchDrop.propTypes = {
  label: PropTypes.string.isRequired,
  resourceName: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  searchFilterFunction: PropTypes.func.isRequired,
  displayFunction: PropTypes.func,
  onNewSelected: PropTypes.func,
}
