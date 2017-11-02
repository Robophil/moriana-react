import React from 'react'
import { connect } from 'react-redux'
import { getReportInfo, runReport } from 'reports'
import ReportFilters from 'report-filters'
import ReportTable from 'report-table'
import h from 'helpers'

export class ReportsPage extends React.Component {

  componentDidMount = () => {
    const {dbName, currentLocationName, params} = this.props.route
    this.props.getReportInfo(dbName, currentLocationName).then(() => {
      this.props.runReport()
    })
  }

  filterSet = (filterType, filterIndex) => {
    this.props.runReport(this.state.currentReport, filterType, filterIndex)
  }

  changeReport = (event) => {
    event.preventDefault(event)
    const currentReport = event.target.dataset.type
    const locationSplit = window.location.href.split('/')
    locationSplit[locationSplit.length - 1] = currentReport
    window.history.replaceState(null, null, locationSplit.join('/'))
    this.props.runReport(currentReport)
  }

  download = (event) => {
    event.preventDefault()
  }

  render () {
    const {
      currentReport,
      allItemsFetched,
      reportTypes,
      reportHeaders,
      reportRows,
      allDateFilters,
      allCategoryFilters,
      allBatchFilters,
      dateFilter,
      categoryFilter,
      batchFilter
    } = this.props

    if (!allItemsFetched) return (<div className='loader' />)

    return (
      <div className='reports-page'>
        <h5>Reports</h5>
        <span className='links'>
          {Object.keys(reportTypes).map((slug, i) => {
            const activeClass = (slug === currentReport) ? 'disabled-link' : ''
            return (
              <a
                key={i}
                href='#'
                className={activeClass}
                onClick={this.changeReport}
                data-type={slug}>
                  {reportTypes[slug].name}
              </a>
            )
          })}
        </span>
        {allItemsFetched
        ? (
          <div>
            <ReportFilters
              allDateFilters={allDateFilters}
              allCategoryFilters={allCategoryFilters}
              allBatchFilters={allBatchFilters}
              dateFilter={dateFilter}
              categoryFilter={categoryFilter}
              batchFilter={batchFilter}
              filterSet={this.filterSet}
            />
            <div className='report'>
              <div className='pull-right'>
                <a href='#' onClick={this.download}>Download</a>
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
