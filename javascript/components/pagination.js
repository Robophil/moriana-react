import React from 'react'
import h from 'helpers'

export default class Pagination extends React.Component {
  render () {
    const { count, dbName, displayedCount, limit } = this.props
    const offset = Number(this.props.offset) || 0
    const startingNumber = 1 + offset
    const previousNumber = offset ? offset - limit : ''
    const nextNumber = offset + displayedCount < count ? offset + limit : ''
    const previousLinkClasses = offset ? '' : 'disabled-link'
    const nextLinkClasses = nextNumber ? '' : 'disabled-link'
    return (
      <span className='pagination'>
        <ul>
          <li className={previousLinkClasses}>
            <a href={`/#d/${dbName}/${previousNumber}`}>&nbsp; « &nbsp;</a>
          </li>
          <li>
            {h.num(startingNumber)} - {h.num(offset + displayedCount)} of {h.num(count)}
          </li>
          <li className={nextLinkClasses}>
            <a href={`/#d/${dbName}/${nextNumber || offset}`}>&nbsp; » &nbsp;</a>
          </li>
        </ul>
      </span>
    )
  }
}
