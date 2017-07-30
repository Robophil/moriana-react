import React from 'react'
import { connect } from 'react-redux'
import { getReportInfo } from 'reports'
import ShipmentsTable from 'shipments-table'
import ReportFilters from 'report-filters'

export class ReportsPage extends React.Component {
  state = { reportType: {} }

  componentDidMount = () => {
    this.props.getReportInfo(this.props.route.dbName)
  }

  changeReport = (event) => {
    event.preventDefault(event)
    const locationSplit = window.location.href.split('/')
    locationSplit[locationSplit.length - 1] = event.target.dataset.type
    history.replaceState(null, null, locationSplit.join('/'))
    this.setState({ reportType: event.target.dataset.type })
  }

  render () {
    const { loading, route, reportTypes, transactions } = this.props
    const { dbName, currentLocationName, params } = route
    const activeReport = this.state.reportType || params.reportType || null
    return (
      <div className='reports'>
        {
          transactions.length === 0 && loading ? ( <div className='loader' /> )
          : (
            <div>
              <br />
              <ul className='nav nav-pills'>
                <li>
                  <h5>Reports &nbsp; &nbsp; </h5>
                </li>
                {Object.keys(reportTypes).map((slug, i) => {
                  const activeClass = (slug === activeReport) ? 'active' : ''
                  return (<li key={i} className={`report-links consumption ${activeClass}`}>
                    <a onClick={this.changeReport} data-type={slug}>{reportTypes[slug].name}</a>
                  </li>)
                })}
                <button className='btn btn-default btn-md pull-right'>Download</button>
              </ul>
              <hr />
              <ReportFilters
                allDateFilters={this.props.allDateFilters}
                allCategoryFilters={this.props.allCategoryFilters}
                allBatchFilters={this.props.allBatchFilters}
                dateFilter={this.props.dateFilter}
                categoryFilter={this.props.categoryFilter}
                batchFilter={this.props.batchFilter}
              />
            </div>
          )
        }
      </div>
    )
  }
}

export default connect(
  state => state.reports,
  { getReportInfo }
)(ReportsPage)
