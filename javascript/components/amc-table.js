import React from 'react'
import h from 'helpers'
import {getAMCDetails} from 'amc'

export default class extends React.Component {
  state = { show: false }

  toggleTable = (event) => {
    event.preventDefault()
    this.setState({ showTable: !this.state.showTable })
  }
  render () {
    const {transactions, excludedLocations} = this.props
    const amcDetails = getAMCDetails(transactions, excludedLocations)
    const {showTable} = this.state
    return (
      <div className='six columns'>
        <h6>
          Average Monthly Consumption <a href='#' onClick={this.toggleTable}>{showTable ? 'hide' : 'show'} table</a>
        </h6>
        {this.state.showTable && (
          <table className='no-hover'>
            <thead>
              <tr>
                <th>Year</th>
                <th>Jan</th>
                <th>Feb</th>
                <th>Mar</th>
                <th>Apr</th>
                <th>May</th>
                <th>Jun</th>
                <th>Jul</th>
                <th>Aug</th>
                <th>Sep</th>
                <th>Oct</th>
                <th>Nov</th>
                <th>Dec</th>
              </tr>
            </thead>
            <tbody>
              {amcDetails.byYear.map((year, i) => (
                <tr key={i}>
                  <td>{h.num(year.year)}</td>
                  <td>{h.num(year.months['01'])}</td>
                  <td>{h.num(year.months['02'])}</td>
                  <td>{h.num(year.months['03'])}</td>
                  <td>{h.num(year.months['04'])}</td>
                  <td>{h.num(year.months['05'])}</td>
                  <td>{h.num(year.months['06'])}</td>
                  <td>{h.num(year.months['07'])}</td>
                  <td>{h.num(year.months['08'])}</td>
                  <td>{h.num(year.months['09'])}</td>
                  <td>{h.num(year.months['10'])}</td>
                  <td>{h.num(year.months['11'])}</td>
                  <td>{h.num(year.months['12'])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <div className='row'>
          <div className='six columns'>
            AMC last six months: {h.num(amcDetails.amcSixMonths)}<br />
            AMC last twelve months: {h.num(amcDetails.amcTwelveMonths)}<br />
          </div>
          <div className='six columns'>
            Lowest month: {h.num(amcDetails.min)}<br />
            Highest month: {h.num(amcDetails.max)}<br />
          </div>
        </div>
      </div>
    )
  }
}
