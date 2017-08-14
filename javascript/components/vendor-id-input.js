import React from 'react'
import PropTypes from 'prop-types'

export default class VendorIdInput extends React.Component {
  state = { inputValue: '' }

  componentDidMount = (newProps) => {
    if (this.props.value) {
      this.setState({ inputValue: this.props.value })
    }
  }

  onChange = (event) => {
    this.setState({ inputValue: event.currentTarget.value })
  }

  onBlur = () => {
    this.props.valueUpdated(this.props.valueKey, this.state.inputValue)
  }

  render () {
    const {inputValue} = this.state
    return (
      <div className='form-group field'>
        <label className='col-lg-2 control-label'>Vendor Id</label>
        <div className='col-sm-9'>
          <input
            value={inputValue}
            onChange={this.onChange}
            className='form-control form-input'
            onBlur={this.onBlur}
            type='text' />
        </div>
      </div>
    )
  }
}

VendorIdInput.propTypes = {
  value: PropTypes.string,
  valueKey: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired
}
