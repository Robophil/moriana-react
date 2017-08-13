import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'
import ClickOutHandler from 'react-onclickout'

export default class LocationsSearch extends React.Component {
  state = {
    showEdit: false,
    inputValue: '',
    localError: false,
    visibleLocations: [],
    currIndex: 0,
    showSearch: false,
  }

  componentDidMount = () => {
    this.setState({ visibleLocations: this.props.locations.slice(0, 25) })
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({ showEdit: !newProps.value.name })
    if (newProps.locations) {
      this.setState({ visibleLocations: newProps.locations.slice(0, 25) })
    }
  }

  onKeyUp = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.locationSelected(this.state.currIndex)
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
        if (this.state.currIndex === (this.state.visibleLocations.length - 1)) {
          this.setState({ currIndex: 0 })
        } else {
          this.setState({ currIndex: this.state.currIndex + 1 })
        }
        break
      }
      case 'ARROW_UP': {
        if (this.state.currIndex < 0) {
          this.setState({ currIndex: this.state.visibleLocations.length - 1 })
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
    const visibleLocations = this.props.locations.filter(location =>
      (location.name.toLowerCase().indexOf(cleanedQuery) != -1)
    )
    this.setState({inputValue, visibleLocations, localError: false, currIndex: 0 })
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
    this.locationSelected(Number(event.currentTarget.dataset.index))
  }

  locationSelected = (index) => {
    if (index === this.state.visibleLocations.length) {
      if (this.props.onNewSelected) {
        this.props.onNewSelected(this.state.inputValue)
        this.hideSearch()
      }
    } else {
      this.props.valueUpdated(this.props.valueKey, this.state.visibleLocations[index])
    }
  }

  render () {
    const allowNew = this.props.onNewSelected ? true : false
    const { inputValue, localError, showEdit, currIndex, visibleLocations, showSearch } = this.state
    const { value, label, locations } = this.props
    return (
      <ClickOutHandler onClickOut={this.hideSearch}>
        <div className={`form-group field ${localError ? 'has-error' : ''}`}>
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
                {localError && (<p className='error help-block'>
                   Location is required.
                </p>)}
                {showSearch && (
                  <div className='search-drop form-input'>
                    <div className='list-group'>
                      {visibleLocations.map((location, i) => (
                        <a
                          data-index={i}
                          className={`list-group-item result ${currIndex === i ? 'active' : ''}`}
                          key={i}
                          onMouseEnter={this.setCurrIndex}
                          onClick={this.onClick}
                        >
                          {h.displayLocationName(location)}
                        </a>
                      ))}
                      <a
                        data-index={visibleLocations.length}
                        onMouseEnter={this.setCurrIndex}
                        onClick={this.onClick}
                        className={`list-group-item result ${currIndex === visibleLocations.length ? 'active' : ''}`}
                      >
                        Locations: {visibleLocations.length} of {locations.length}
                        {allowNew && (<strong> | Add New Location</strong>)}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='col-sm-9'>
                <div className='form-control-static '>
                  <span className='static-value'>{h.displayLocationName(value)}</span>
                  &nbsp;(<a onClick={this.toggleEdit}>edit</a>)
                </div>
              </div>
            )}
        </div>
      </ClickOutHandler>
    )
  }
}

LocationsSearch.propTypes = {
  label: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  onNewSelected: PropTypes.func,
}
