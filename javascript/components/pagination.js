import React from 'react'
import { Link } from 'react-router-dom'
import h from 'helpers'

export default class extends React.Component {
  clicked = () => {
    
  }
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
              <Link onClick={this.} className='darker trigger-page' to={`/d/${dbName}/${previousNumber}`}>
                «
              </Link>
            </li>
            <li>
              <Link className='darker trigger-page' to={`/d/${dbName}/`}>
                {h.num(startingNumber)} - {h.num(offset + displayedCount)} of {h.num(count)}
              </Link>
            </li>
            <li className={nextNumber ? '' : 'disabled'}>
              <Link className='darker trigger-page' to={`/d/${dbName}/${nextNumber}`}>
                »
              </Link>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}
