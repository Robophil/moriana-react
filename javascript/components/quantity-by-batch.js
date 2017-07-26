import React from 'react'
import h from 'helpers'
import StockCardLink from 'stockcard-link'

export default class extends React.Component {
  render () {
    const { batches, dbName} = this.props
    return (
      <div className='col-md-5 no-print'>
        <h4>Quantity by Batch</h4>
        <table className='table text-center table-striped table-bordered table-small table-hover'>
          <thead>
            <tr>
              <th className='text-center'>Expiration</th>
              <th className='text-center'>Lot</th>
              <th className='text-center'>Total Quantity</th>
              <th className='text-center'>Filter</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((row, i) => (
              <tr key={i}>
                <td>{h.expiration(row.expiration)}</td>
                <td>{row.lot}</td>
                <td>{h.num(row.sum)}</td>
                <td>
                  <StockCardLink
                    dbName={dbName}
                    transaction={row}
                    atBatch>
                    filter
                  </StockCardLink>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
