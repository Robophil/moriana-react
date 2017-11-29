import React from 'react'
import h from 'utils/helpers'

export default class EditTransactionsTable extends React.Component {
  onClick = (event) => {
    this.props.onEditClick(event.currentTarget.dataset.index)
  }

  render () {
    return (
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Category</th>
            <th>Lot Number</th>
            <th>Expiration</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Total Value</th>
            <th>User</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {this.props.transactions.map((t, i) => (
            <tr key={i} onClick={this.onClick} data-index={i}>
              <td>{t.item}</td>
              <td>{t.category}</td>
              <td>{t.lot}</td>
              <td>{h.expiration(t.expiration)}</td>
              <td>{h.num(t.quantity)}</td>
              <td>{h.currency(t.unitPrice)}</td>
              <td>{h.currency(t.unitPrice * t.quantity)}</td>
              <td>{t.username}</td>
              <td><button>edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}
