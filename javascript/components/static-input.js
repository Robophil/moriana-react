import React from 'react'
import PropTypes from 'prop-types'

export default class StaticInput extends React.Component {
  render () {
    const { label, value, onEditClick, className } = this.props
    let classes = className || ''
    return (
      <div className={`form-group field ${classes}`}>
        <label className='col-lg-2 control-label'>{label}</label>
        <div className='col-sm-9'>
          <div className='form-control-static '>
            <span className='static-value'>{value}</span>
            {(onEditClick && <span>&nbsp;(<a onClick={onEditClick}>edit</a>)</span>)}
          </div>
        </div>
      </div>
    )
  }
}

StaticInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onEditClick: PropTypes.func
}
