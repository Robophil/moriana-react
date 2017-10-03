import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'
import ClickOutHandler from 'react-onclickout'

export default class NewLocation extends React.Component {
  state = { name: '', checked: false }

  componentDidMount = () => {
    if (this.props.value) {
      this.setState({ name: this.props.value })
    }
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.onSubmit()
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
    }
  }

  nameChanged = (event) => {
    const name = event.currentTarget.value
    this.setState({ name })
  }

  checkboxChanged = (event) => {
    this.setState({ checked: event.currentTarget.checked })
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    const {name, checked} = this.state
    const attributes = checked ? { excludeFromConsumption: true } : {}
    if (name) {
      this.props.valueUpdated(this.props.valueKey, { name, attributes })
      this.props.closeClicked()
    }
  }

  render () {
    return (
      <ClickOutHandler onClickOut={this.props.closeClicked}>
        <div className='modal'>
          <div>
            <button className='close' onClick={this.props.closeClicked}>
              <span>×</span>
            </button>
            <h5>New Location</h5>
          </div>
          <div>
            <form onSubmit={this.onSubmit}>
              <fieldset>
                <div>
                  <div className='row'>
                    <label>Name</label>
                    <div className='input-group'>
                      <input
                        type='text'
                        value={this.state.name}
                        onChange={this.nameChanged}
                        onKeyDown={this.onKeyDown}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className='row consumption-check-box'>
                    <label htmlFor='donottrack'>Do not track as consumption</label>
                    <input id='donottrack' type='checkbox' checked={this.state.checked} onChange={this.checkboxChanged} />
                  </div>
                </div>
                <div>
                  <button onClick={this.props.closeClicked}>Cancel</button>
                  <button onClick={this.onSubmit} className='button-primary'>OK</button>
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </ClickOutHandler>
    )
  }
}

NewLocation.propTypes = {
  value: PropTypes.string,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired
}
