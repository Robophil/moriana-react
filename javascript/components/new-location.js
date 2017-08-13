import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'

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
    }
  }

  render () {
    return (
      <div className='modal fade in'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' onClick={this.props.closeClicked}>
                <span>×</span>
              </button>
              <h4 className='modal-title'>New Location</h4>
            </div>
            <div className='modal-body'>
              <form className='form-horizontal edit-location-form'>
                <fieldset>
                  <div className='edit-fields'>
                    <div className='form-group'>
                      <label className='col-lg-2 control-label'>Name</label>
                      <div className='col-lg-10'>
                        <input
                          type='text'
                          className='form-control form-input'
                          value={this.state.name}
                          onChange={this.nameChanged}
                          onKeyDown={this.onKeyDown}
                          autoFocus
                        />
                      </div>
                    </div>
                    <br /><br />
                    <div className='form-group'>
                      <label className='col-lg-2 control-label'>Do not track as consumption</label>
                      <div className='col-lg-10'>
                        <input type='checkbox' checked={this.state.checked} onChange={this.checkboxChanged} />
                      </div>
                    </div>
                  </div>
                  <br /><br />
                  <div className='form-group'>
                    <div className='col-lg-10 col-lg-offset-2'>
                      <button onClick={this.props.closeClicked} className='btn btn-default'>Cancel</button>
                      <button onClick={this.onSubmit} className='btn btn-primary'>OK</button>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
          <br />
        </div>
      </div>
    )
  }
}

NewLocation.propTypes = {
  value: PropTypes.string,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
}
