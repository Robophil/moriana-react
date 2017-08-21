import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'
import StaticInput from 'static-input'
import {dateIsValid} from 'validation'
import {getISODateFromInput} from 'input-transforms'

export default class DateInput extends React.Component {
  state = { showEdit: false, inputValue: '', error: false }

  toggleEdit = (event) => {
    if (event) event.preventDefault()
    this.setState({ showEdit: !this.state.showEdit })
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.value) {
      this.setState({ showEdit: false })
    }
  }

  onChange = (event) => {
    const inputValue = event.currentTarget.value
    this.setState({inputValue, error: false})
  }

  onBlur = (event) => {
    const {inputValue} = this.state
    const isValid = dateIsValid(this.state.inputValue)
    if (isValid) {
      const isoDate = getISODateFromInput(inputValue)
      this.props.valueUpdated('date', isoDate)
    } else {
      this.setState({ error: true })
    }
  }

  render () {
    const { inputValue, error, showEdit } = this.state
    const { value } = this.props
    if (showEdit) {
      return (
        <div className={`form-group field ${error ? 'has-error' : ''}`}>
          <label className='col-lg-2 control-label'>Date</label>
          <div className='col-sm-9 input-group'>
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
        </div>
      )
    } else {
      return (<StaticInput label={'Date'} value={h.formatDate(value)} onEditClick={this.toggleEdit} />)
    }
  }
}

DateInput.propTypes = {
  value: PropTypes.string,
  valueUpdated: PropTypes.func.isRequired
}
