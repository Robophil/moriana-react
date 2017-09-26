import React from 'react'
import { connect } from 'react-redux'
import { getReportInfo, runReport } from 'reports'
import ReportFilters from 'report-filters'
import ReportTable from 'report-table'
import h from 'helpers'

export class ReportsPage extends React.Component {
  state = { reportType: null }

  componentDidMount = () => {
    this.setState({ reportType: this.props.route.params.reportType || 'consumption' })
    this.props.getReportInfo(this.props.route.dbName, this.props.route.currentLocationName).then(() => {
      this.props.runReport(this.state.reportType)
    })
  }

  filterSet = (filterType, filterIndex) => {
    this.props.runReport(this.state.reportType, filterType, filterIndex)
  }

  changeReport = (event) => {
    event.preventDefault(event)
    const locationSplit = window.location.href.split('/')
    locationSplit[locationSplit.length - 1] = event.target.dataset.type
    window.history.replaceState(null, null, locationSplit.join('/'))
    this.setState({ reportType: event.target.dataset.type })
  }

  render () {
    const { allItemsFetched, reportTypes, reportHeaders, reportRows } = this.props
    if (!allItemsFetched) return (<div className='loader' />)
    return (
      <div className='reports-page'>
        <h5>Reports</h5>
        <span className='links'>
          {Object.keys(reportTypes).map((slug, i) => {
            const activeClass = (slug === this.state.reportType) ? 'active' : ''
            return (
              <a key={i} href className={`${activeClass}`} onClick={this.changeReport} data-type={slug}>
                {reportTypes[slug].name}
              </a>
            )
          })}
        </span>
        {allItemsFetched
        ? (
          <div>
            <ReportFilters
              allDateFilters={this.props.allDateFilters}
              allCategoryFilters={this.props.allCategoryFilters}
              allBatchFilters={this.props.allBatchFilters}
              dateFilter={this.props.dateFilter}
              categoryFilter={this.props.categoryFilter}
              batchFilter={this.props.batchFilter}
              filterSet={this.filterSet}
            />
            <div className='report'>
              <div className='pull-right'>
                <a href className='button-small'>Download</a>
                <span>Rows: {h.num(reportRows.length)}</span>
              </div>
              <ReportTable headers={reportHeaders} rows={reportRows} />
            </div>
          </div>
        )
        : (<div className='loader' />)}
      </div>
    )
  }
}

export default connect(
  state => state.reports,
  { getReportInfo, runReport }
)(ReportsPage)
