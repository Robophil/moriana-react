import React from 'react'
import h from 'utils/helpers'
import {buildStockCardHref} from 'components/stockcard-link'

export default class extends React.Component {
  stockLinkClicked = (event) => {
    const {item, category} = event.currentTarget.dataset
    window.location.href = buildStockCardHref(this.props.dbName, {item, category})
  }

  render () {
    const {headers, rows} = this.props
    return (
      <div>
        <table>
          <thead>
            <tr>{headers.map((header, i) => (<th key={i}>{header.name}</th>))}</tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} data-item={row.item} data-category={row.category} onClick={this.stockLinkClicked}>
                {headers.map((header, j) => {
                  let value
                  if (header.key === 'expiration') {
                    value = h.expiration(row[header.key])
                  } else if (header.key === 'date') {
                    value = h.formatDate(row[header.key])
                  } else {
                    value = h.num(row[header.key])
                  }
                  return (<td key={j}>{value}</td>)
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (<div className='text-center'>No results found.</div>)}
      </div>
    )
  }
}
