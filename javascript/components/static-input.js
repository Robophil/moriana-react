import React from 'react'
import PropTypes from 'prop-types'

export default class StaticInput extends React.Component {
  render () {
    const { label, value, onEditClick, className } = this.props
    let classes = className ? `${className} row` : 'row'
    return (
      <div className={classes}>
        <label>{label}</label>
        <div className='input-group'>
          <span>{value}</span>
          {(onEditClick && <span>&nbsp;(<a onClick={onEditClick}>edit</a>)</span>)}
        </div>
      </div>
    )
  }
}

StaticInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object
  ]),
  onEditClick: PropTypes.func
}
