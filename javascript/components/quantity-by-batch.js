import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  render () {
    const {batches} = this.props
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
                <td><a href='#d/moriana_central_warehouse/stockcard/TB%20Medication/Pyridoxine%2025mg%201000/2018-10-01T00:00:00.000Z__'>filter</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}
