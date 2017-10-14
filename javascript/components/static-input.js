import React from 'react'

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
