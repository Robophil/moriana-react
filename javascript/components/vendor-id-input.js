import React from 'react'

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
    if (this.state.inputValue !== this.props.value) {
      this.props.valueUpdated('vendorId', this.state.inputValue)
    }
  }

  render () {
    const {inputValue} = this.state
    return (
      <div>
        <label>Vendor Id</label>
        <input
          className='input-group'
          value={inputValue}
          onChange={this.onChange}
          onBlur={this.onBlur}
          type='text' />
      </div>
    )
  }
}
