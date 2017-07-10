import React from 'react'

export default class extends React.Component {
  render () {
    return (
      <div className='col-md-7'>
        <div className='count-transactions'>
          <h4>
            Average Monthly Consumption
            <button href='#' className='btn btn-default bn-sm show-counts-table'>table</button>
          </h4>
          <table className='table table-striped table-bordered table-small table-hover counts-table hidden'>
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
              <tr>
                <td><strong>2017</strong></td>
                <td>34,000</td>
                <td>65,000</td>
                <td>65,000</td>
                <td>40,000</td>
                <td>86,000</td>
                <td>35,000</td>
                <td>10,000</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
                <td>0</td>
              </tr>
            </tbody>
          </table>
          <div className='row'>
            <div className='col-lg-5'>
              <strong>AMC last six months: </strong> 54,167<br />
              <strong>AMC last twelve months: </strong> 36,500<br />
            </div>
            <div className='col-lg-4'>
              <strong>Lowest month: </strong> 4,000<br />
              <strong>Highest month: </strong> 109,000<br />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
