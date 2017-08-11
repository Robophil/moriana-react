import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'
import {validateDateInput} from 'validation'
import {getISODateFromInput} from 'input-transforms'

export default class DateInput extends React.Component {
  state = { showEdit: false, inputValue: '', error: false  }

  toggleEdit = (event) => {
    if (event) event.preventDefault()
    this.setState({ showEdit: !this.state.showEdit })
  }

  onChange = (event) => {
    const inputValue = event.currentTarget.value
    this.setState({inputValue, error: false})
  }

  onBlur = (event) => {
    const {inputValue} = this.state
    const error = validateDateInput(inputValue)
    if (error) {
      this.setState({error})
    } else {
      this.toggleEdit()
      const value = getISODateFromInput(inputValue)
      this.props.valueUpdated(this.props.valueKey, value)
    }
  }

  render () {
    const { inputValue, error } = this.state
    const { value } = this.props
    return (
      <div className={`form-group field date save-on-blur ${error ? 'has-error' : ''}`}>
        <label className='col-lg-2 control-label'>Date</label>
          {this.state.showEdit ? (
            <div className='col-sm-9'>
              <input
                onBlur={this.onBlur}
                value={inputValue}
                onKeyUp={this.onKeyUp}
                onChange={this.onChange}
                className='form-control form-input'
                autoFocus
                type='text' />
              {error && (<p className='error help-block'>
                Date must be format "YYYY-MM-DD or "t-1" or "t+1" (e.g. today - 1, today + 1)"
              </p>)}
            </div>
          ) : (
            <div className='col-sm-9'>
              <div className='form-control-static '>
                <span className='static-value'>{h.formatDate(value)}</span>
                &nbsp;(<a onClick={this.toggleEdit}>edit</a>)
              </div>
            </div>
          )}
      </div>
    )
  }
}

DateInput.propTypes = {
  value: PropTypes.string,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
}
