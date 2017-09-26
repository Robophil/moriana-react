import React from 'react'
import h from 'helpers'
import {buildStockCardHref} from 'stockcard-link'

export default class extends React.Component {
  filter = (event) => {
    const {item, category, expiration, lot} = event.currentTarget.dataset
    window.location.href = buildStockCardHref(this.props.dbName, {item, category, expiration, lot}, true)
  }
  render () {
    const { batches } = this.props
    return (
      <div className='three columns'>
        {batches.length ? (
          <span>
            <h6>Quantity by Batch (click batch to filter)</h6>
            <table>
              <thead>
                <tr>
                  <th>Expiration</th>
                  <th>Lot</th>
                  <th>Total Quantity</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((row, i) => (
                  <tr onClick={this.filter} key={i} data-item={row.item} data-category={row.category} data-expiration={row.expiration} data-lot={row.lot}>
                    <td>{h.expiration(row.expiration)}</td>
                    <td>{row.lot}</td>
                    <td>{h.num(row.sum)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </span>
        ) : (
          <div>No available stock.</div>
        )}
      </div>
    )
  }
}
