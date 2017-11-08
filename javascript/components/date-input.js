import React from 'react'
import h from 'helpers'
import StaticInput from 'static-input'
import {dateIsValid} from 'validation'
import {getISODateFromInput} from 'input-transforms'

export default class DateInput extends React.Component {
  state = { showEdit: true, inputValue: '', error: false }

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
    const { updateKey = 'date' } = this.props
    const isValid = dateIsValid(inputValue)
    if (!inputValue) {
      return
    } else if (isValid) {
      const isoDate = getISODateFromInput(inputValue)
      this.props.valueUpdated(updateKey, isoDate)
    } else {
      this.setState({ error: true })
    }
  }

  render () {
    const { inputValue, error, showEdit } = this.state
    const { value, autoFocus, label = 'Date' } = this.props
    const classes = error ? 'row error' : 'row'
    if (showEdit) {
      return (
        <div className={classes}>
          <label>{label}</label>
          <div className='input-group'>
            <input
              onBlur={this.onBlur}
              value={inputValue}
              onKeyUp={this.onKeyUp}
              onChange={this.onChange}
              autoFocus={autoFocus}
              type='text' />
            {error && (<p className='error'>
              Date must be format "YYYY-MM-DD or "t-1" or "t+1" (e.g. today - 1, today + 1)"
            </p>)}
          </div>
        </div>
      )
    } else {
      return (<StaticInput label={label} value={h.formatDate(value)} onEditClick={this.toggleEdit} />)
    }
  }
}
