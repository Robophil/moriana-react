import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  render () {
    const {headers, rows} = this.props
    return (
      <table>
        <thead>
          <tr>{headers.map((header, i) => (<th key={i}>{header.name}</th>))}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>{headers.map((header, j) => (<td key={j}>{
              (header.key === 'expiration')
              ? h.expiration(row[header.key])
              : h.num(row[header.key])
            }</td>))}</tr>
          ))}
        </tbody>
      </table>
    )
  }
}
