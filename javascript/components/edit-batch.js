import React from 'react'
import PropTypes from 'prop-types'
import h from 'helpers'

export default class EditBatch extends React.Component {
  state = {
    quantity: '',
    expiration: '',
    lot: '',
    unitPrice: '',
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

  valueChanged = (event) => {
    const stateUpdate = {}
    stateUpdate[event.currentTarget.dataset.key] = event.currentTarget.value
    this.setState(stateUpdate)
  }

  onSubmit = (event) => {
    if (event) event.preventDefault()
    const { item, category } = this.props
    const { quantity, expiration, lot, unitPrice } = this.state
    if (quantity) {
      this.props.valueUpdated('receive_transaction', { item, category, quantity, expiration, lot, unitPrice })
    }
  }

  render () {
    const {item, category} = this.props
    const fields = [
      { name: 'Quantity', key: 'quantity', errorMessage: 'Quantity is required and must be a number.' },
      { name: 'Expiration', key: 'expiration', errorMessage: 'Expiration must be format "MM/YY", "MM/YYYY" or "YYYY-MM-DD".' },
      { name: 'Lot', key: 'lot' },
      { name: 'Unit Price', key: 'unitPrice', errorMessage: 'Unit price must be a number.'  },
    ]
    return (
      <div className='modal fade in'>
        <div className='modal-dialog modal-lg'>
          <div className='modal-content'>
            <div className='modal-header'>
              <button type='button' className='close' onClick={this.props.closeClicked}>
                <span>×</span>
              </button>
              <h4 className='modal-title'>{item} {category}</h4>
            </div>
            <div className='modal-body'>
              <form className='form-horizontal edit-location-form'>
                <fieldset>
                  <div className='edit-fields'>
                    {fields.map((field, i) => (
                      <div key={i} className='form-group'>
                        <label className='col-lg-2 control-label'>{field.name}</label>
                        <div className='col-lg-10'>
                          <input
                            type='text'
                            className='form-control form-input'
                            value={this.state[field.key]}
                            data-key={`${field.key}`}
                            onChange={this.valueChanged}
                            onKeyDown={this.onKeyDown}
                            autoFocus={(i === 0)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
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

EditBatch.propTypes = {
  item: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  valueUpdated: PropTypes.func.isRequired,
  closeClicked: PropTypes.func.isRequired,
}
