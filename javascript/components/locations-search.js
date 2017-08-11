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

  componentWillReceiveProps = (newProps) => {
    if (!newProps.value.name) {
      this.setState({ showEdit: true })
    }
    if (newProps.locations) {
      this.setState({ visibleLocations: newProps.locations.slice(0, 25) })
    }
  }

  onChange = (event) => {
    const inputValue = event.currentTarget.value
    const cleanedQuery = inputValue.toLowerCase().trim()
    const visibleLocations = this.props.locations.filter(location =>
      (location.name.toLowerCase().indexOf(cleanedQuery) != -1)
    )
    this.setState({inputValue, visibleLocations, localError: false, currIndex: 0 })
  }

  onBlur = (event) => {
    const {inputValue} = this.state
    // this.props.valueUpdated(this.props.valueKey, inputValue)
  }

  toggleEdit = (event) => {
    if (event) event.preventDefault()
    this.setState({ showEdit: !this.state.showEdit, showSearch: !this.state.showSearch })
  }

  showSearch = () => {
    if (!this.state.showSearch) this.setState({ showSearch: true })
  }

  hideSearch = () => {
    if (this.state.showSearch) this.setState({ showSearch: false })
  }

  onClick = (event) => {
    this.locationSelected(Number(event.currentTarget.dataset.index))
  }

  locationSelected = (index) => {
    this.props.valueUpdated(this.props.valueKey, this.state.visibleLocations[index])
    this.toggleEdit()
  }

  onKeyUp = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.locationSelected([this.state.currIndex])
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

  setCurrIndex = (event) => {
    this.setState({ currIndex: Number(event.target.dataset.index) })
  }

  displayLocationName = (location) => {
    const map = { E: 'external', EV: 'virtual', I: 'internal', P: 'patient' }
    const excludedFromConsumption = location.attributes && location.attributes.excludeFromConsumption
    return `${location.name} (${map[location.type]}) ${excludedFromConsumption ? '(excluded from consumption)' : ''}`
  }

  render () {
    const { inputValue, localError, showEdit, currIndex, visibleLocations, showSearch } = this.state
    const { value, label, locations } = this.props
    return (
      <ClickOutHandler onClickOut={this.hideSearch}>
        <div className={`form-group field date save-on-blur ${localError ? 'has-error' : ''}`}>
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
                          {this.displayLocationName(location)}
                        </a>
                      ))}
                      <a
                        data-index={visibleLocations.length}
                        onMouseEnter={this.setCurrIndex}
                        className={`list-group-item result ${currIndex === visibleLocations.length ? 'active' : ''}`}
                      >
                        Locations: {visibleLocations.length} of {locations.length} | <strong>Add New Location</strong>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='col-sm-9'>
                <div className='form-control-static '>
                  <span className='static-value'>{`${value.name} -- ${value.type}`}</span>
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
  locations: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  value: PropTypes.object.isRequired,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
}
