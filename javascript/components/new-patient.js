import React from 'react'
import h from 'helpers'
import { searchLocations } from 'locations'
import { getDobFromInput, getPatientForShipment } from 'input-transforms'
import {dobIsValid} from 'validation'
import ClickOutHandler from 'react-onclickout'
import SearchDrop from 'search-drop'
import StaticInput from 'static-input'

export default class NewLocation extends React.Component {
  state = {
    name: '',
    identifier: '',
    gender: null,
    dobInput: '',
    dob: null,
    dobError: false,
    district: ''
  }

  componentDidMount = () => {
    if (this.props.value) {
      this.setState({ name: this.props.value })
    }
  }

  onKeyDown = (event) => {
    switch (h.keyMap(event.keyCode)) {
      case 'ENTER': {
        this.onSubmit(event)
        break
      }
      case 'ESCAPE': {
        this.props.closeClicked()
        break
      }
    }
  }

  onChangeName = (event) => {
    const name = event.currentTarget.value
    this.setState({ name })
  }

  onChangeIdentifier = (event) => {
    const identifier = event.currentTarget.value
    this.setState({ identifier })
  }

  onChangeDob = (event) => {
    const dobInput = event.currentTarget.value
    this.setState({ dobInput, dobError: !dobIsValid(dobInput) })
  }

  onBlurDob = (event) => {
    this.validateAndSetDob()
  }

  validateAndSetDob = () => {
    if (dobIsValid(this.state.dobInput)) {
      this.setState({ dobError: false, dob: getDobFromInput(this.state.dobInput) })
    } else {
      this.setState({ dobError: true })
    }
  }

  toggleEditDob = () => {
    this.setState({ dob: null })
  }

  districtSelected = (district) => {
    this.setState({ district: district.name })
  }

  newDistrictSelected = (district) => {
    this.setState({district})
  }

  onClickGender = (event) => {
    this.setState({ gender: event.currentTarget.value })
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    this.validateAndSetDob()
    const {name, dob, dobError } = this.state
    if (name && !dobError) {
      this.props.valueUpdated('patient', getPatientForShipment(this.state))
      this.props.closeClicked()
    }
  }

  render () {
    const {name, identifier, dobInput, dob, dobError, district } = this.state
    const { districts, districtsLoading } = this.props
    return (
      <ClickOutHandler onClickOut={this.props.closeClicked}>
        <div className='modal'>
          <div>
            <button className='close' onClick={this.props.closeClicked}>
              <span>×</span>
            </button>
            <h5>New Patient</h5>
          </div>
          <div>
            <form onSubmit={this.onSubmit}>
              <fieldset>
                <div>
                  <div className='row'>
                    <label>Patient Name</label>
                    <div className='input-group'>
                      <input
                        type='text'
                        value={name}
                        onChange={this.onChangeName}
                        onKeyDown={this.onKeyDown}
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <label>Identifier</label>
                    <div className='input-group'>
                      <input
                        type='text'
                        value={identifier}
                        onChange={this.onChangeIdentifier}
                        onKeyDown={this.onKeyDown}
                      />
                    </div>
                  </div>
                  <div className='row'>
                    <label>Gender</label>
                    <div className='input-group radio'>
                      <label>
                        <input
                          type='radio'
                          name='gender'
                          value='M'
                          onClick={this.onClickGender}
                          onKeyDown={this.onKeyDown}
                        />
                        <span>Male</span>
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='gender'
                          value='F'
                          onClick={this.onClickGender}
                          onKeyDown={this.onKeyDown}
                        />
                        <span>Female</span>
                      </label>
                      <label>
                        <input
                          type='radio'
                          name='gender'
                          value='N'
                          onClick={this.onClickGender}
                          onKeyDown={this.onKeyDown}
                        />
                        <span>NA</span>
                      </label>
                    </div>
                  </div>
                  {dob ? (
                    <StaticInput
                      label={'Age or Date of Birth'}
                      value={h.formatDate(dob)}
                      onEditClick={this.toggleEditDob}
                    />
                  ) : (
                    <div className='row'>
                      <label>Age or Date of Birth</label>
                      <div className='input-group'>
                        <input
                          type='text'
                          value={dobInput}
                          onChange={this.onChangeDob}
                          onBlur={this.onBlurDob}
                          onKeyDown={this.onKeyDown}
                        />
                        {dobError && (<p className='error'>
                          Date of birth or Age must be format "YYYY-MM-DD or "t-1" or "5" (e.g. 5 years ago)"
                        </p>)}
                      </div>
                    </div>
                  )}
                  <SearchDrop
                    rows={districts}
                    loading={districtsLoading}
                    valueSelected={this.districtSelected}
                    value={{name: district}}
                    onNewSelected={this.newDistrictSelected}
                    searchFilterFunction={searchLocations}
                    label={'District'}
                    resourceName={'district'}
                  />
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
