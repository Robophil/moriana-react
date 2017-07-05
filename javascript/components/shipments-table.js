import React from 'react'
import h from 'helpers'
import { Link } from 'react-router-dom'

export default class extends React.Component {
  render () {
    return (
      <table className='table table-striped table-hover'>
        <thead>
          <tr>
            <th>Date</th>
            <th>From</th>
            <th>To</th>
            <th>Transactions</th>
            <th>Total Value</th>
            <th>View</th>
            <th>Edit</th>
            <th>Last edited</th>
            <th>Created by</th>
          </tr>
        </thead>
        <tbody>
          {this.props.shipments.map((row, i) => (
            <tr key={i}>
              <td className='date'>{h.formatDate(row.date)}<small>({h.dateFromNow(row.date)})</small></td>
              <td className='text-capitalize'>{row.from}</td>
              <td className='text-capitalize'>{row.to}</td>
              <td>{row.totalTransactions}</td>
              <td>{h.num(row.value)}</td>
              <td><Link to={`/d/${this.props.dbName}/shipment/${row.id}`}>view</Link></td>
              <td>
              </td>
              <td><small>{h.dateFromNow(row.updated)}</small></td>
              <td>{row.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
