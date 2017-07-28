import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  state = { show: false  }
  toggleTable = (event) => {
    event.preventDefault()
    this.setState({ showTable: !this.state.showTable })
  }
  render () {
    const { amcDetails } = this.props
    return (
      <div className='col-md-7'>
        <div className='count-transactions'>
          <h4>
            Average Monthly Consumption
            <button onClick={this.toggleTable} href='#' className='btn btn-default bn-sm'>table</button>
          </h4>
          {this.state.showTable && (
            <table className='table table-striped table-bordered table-small table-hover counts-table'>
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
                    <td><strong>{h.num(year.year)}</strong></td>
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
            <div className='col-lg-5'>
              <strong>AMC last six months: </strong> {h.num(amcDetails.amcSixMonths)}<br />
              <strong>AMC last twelve months: </strong> {h.num(amcDetails.amcTwelveMonths)}<br />
            </div>
            <div className='col-lg-4'>
              <strong>Lowest month: </strong> {h.num(amcDetails.min)}<br />
              <strong>Highest month: </strong> {h.num(amcDetails.max)}<br />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
