import React from 'react'
import h from 'helpers'
// import PropTypes from 'prop-types'

export default class Pagination extends React.Component {
  render () {
    const { count, dbName, displayedCount, limit } = this.props
    let offset = Number(this.props.offset)
    offset = offset ? offset : 0
    const startingNumber = 1 + offset
    const previousNumber = offset ? offset - limit : ''
    const nextNumber = offset + displayedCount < count ? offset + limit : ''
    return (
      <div className='pull-right pagination'>
        <div className='pagination'>
          <ul className='pagination pagination-sm'>
            <li className={offset ? '' : 'disabled'}>
              <a className='darker trigger-page' href={`/#d/${dbName}/${previousNumber}`}>
                «
              </a>
            </li>
            <li>
              <a className='darker trigger-page' href={`/#d/${dbName}/`}>
                {h.num(startingNumber)} - {h.num(offset + displayedCount)} of {h.num(count)}
              </a>
            </li>
            <li className={nextNumber ? '' : 'disabled'}>
              <a className='darker trigger-page' href={`/#d/${dbName}/${nextNumber}`}>
                »
              </a>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

// Pagination.propTypes = {
//   count: PropTypes.number.isRequired,
// }
