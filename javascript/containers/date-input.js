import React from 'react'
import h from 'helpers'
import PropTypes from 'prop-types'

export default class DateInput extends React.Component {
  state = { showEdit: false, inputValue: '', localError: false }

  toggleEdit = (event) => {
    if (event) event.preventDefault()
    this.setState({ showEdit: !this.state.showEdit })
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.error) {
      this.setState({ localError: newProps.error })
    } else {
      this.setState({ showEdit: false })
    }
  }

  onChange = (event) => {
    const inputValue = event.currentTarget.value
    this.setState({inputValue, localError: false})
  }

  onBlur = (event) => {
    const {inputValue} = this.state
    this.props.valueUpdated(this.props.valueKey, inputValue)
  }

  render () {
    const { inputValue, localError } = this.state
    const { value } = this.props
    return (
      <div className={`form-group field date save-on-blur ${localError ? 'has-error' : ''}`}>
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
              {localError && (<p className='error help-block'>
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
  error: PropTypes.bool.isRequired,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
}
