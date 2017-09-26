import React from 'react'
import h from 'helpers'

export default class Pagination extends React.Component {
  render () {
    const { count, dbName, displayedCount, limit } = this.props
    const offset = Number(this.props.offset) || 0
    const startingNumber = 1 + offset
    const previousNumber = offset ? offset - limit : ''
    const nextNumber = offset + displayedCount < count ? offset + limit : ''
    return (
      <span className='pagination'>
        <ul>
          <li className={offset ? '' : 'disabled'}>
            <a href={`/#d/${dbName}/${previousNumber}`}>&nbsp; « &nbsp;</a>
          </li>
          <li>
            {h.num(startingNumber)} - {h.num(offset + displayedCount)} of {h.num(count)}
          </li>
          <li className={nextNumber ? '' : 'disabled'}>
            <a href={`/#d/${dbName}/${nextNumber}`}>&nbsp; » &nbsp;</a>
          </li>
        </ul>
      </span>
    )
  }
}
