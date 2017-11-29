import React from 'react'
import { connect } from 'react-redux'

import { getAllDocs } from 'store/alldocs'
import { getLocations } from 'store/locations'
import { shortDatedReport, expiredReport, outOfStockReport, dataQualityReport } from 'utils/other-reports'
import { consumptionReport } from 'utils/consumption-report'
import download from 'utils/download'
import h, { buildDateFilters } from 'utils/helpers'
import { DateFilters, CategoryFilteres } from 'components/report-filters'
import ReportTable from 'components/report-table'

const REPORT_TYPES = [
  { name: 'Monthly Consumption', slug: 'consumption' },
  { name: 'Short Dated', slug: 'shortdated' },
  { name: 'Expired', slug: 'expired' },
  { name: 'Out of Stock', slug: 'outofstock' },
  { name: 'Data Quality', slug: 'dataquality' }
]

const DATE_FILTERS = buildDateFilters()

export class ReportsPage extends React.Component {
  constructor(props) {
    super(props)
    const {reportView} = props.route.params
    this.state = {
      currentReport: reportView || 'consumption',
      atBatchLevel: true,
      dateRange: DATE_FILTERS[0],
      selectedCategory: null,
      displayRows: [],
      displayHeaders: [],
      openFilter: null
    }
  }

  componentDidMount = () => {
    const { dbName, currentLocationName } = this.props.route
    this.props.getAllDocs(dbName, currentLocationName)
    this.props.getLocations(dbName, currentLocationName)
  }

  componentWillReceiveProps = (newProps) => {
    if (newProps.alldocs.initialRequestComplete && newProps.locations.initialRequestComplete) {
      this.runReport(newProps.alldocs.allItems, newProps.locations.locationsExcludedFromConsumption)
    }
  }

  runReport = (allItems, excludedLocations) => {
    allItems = allItems || this.props.alldocs.allItems
    excludedLocations = excludedLocations || this.props.locations.locationsExcludedFromConsumption
    const { atBatchLevel, dateRange, selectedCategory, currentReport } = this.state
    let result
    if (currentReport === 'consumption') {
      result = consumptionReport(allItems, atBatchLevel, dateRange, selectedCategory, excludedLocations)
      } else if (currentReport === 'shortdated') {
        result = shortDatedReport(allItems.byBatch)
      } else if (currentReport === 'expired') {
        result = expiredReport(allItems.byBatch, dateRange)
      } else if (currentReport === 'outofstock') {
        result = outOfStockReport(allItems.byItem)
      } else if (currentReport === 'dataquality') {
        result = dataQualityReport(allItems.byBatch)
    }
    const { displayRows, displayHeaders } = result
    this.setState({ displayRows, displayHeaders })
  }

  onClickReportLink = (event) => {
    event.preventDefault(event)
    const {currentReport} = this.state
    const {reportType} = event.target.dataset
    if (reportType !== currentReport) {
      const locationSplit = window.location.href.split('/')
      locationSplit[locationSplit.length - 1] = reportType
      window.history.replaceState(null, null, locationSplit.join('/'))
      this.setState({ currentReport: reportType }, () => {
        this.runReport()
      })
    }
  }

  onFilterClick = (event) => {
    event.preventDefault()
    const {filter} = event.target.dataset
    const openFilter = this.state.openFilter === filter ? null : filter
    if (openFilter === 'batch') {
      this.setState({ atBatchLevel: !this.state.atBatchLevel, openFilter: false }, () => {
        this.runReport()
      })
    } else {
      this.setState({ openFilter })
    }
  }

  onDateRangeChange = (dateRange) => {
    this.setState({ dateRange, openFilter: false }, () => {
      this.runReport()
    })
  }

  onCategoryFilterChange = (value) => {
    this.setState({ selectedCategory: value, openFilter: false }, () => {
      this.runReport()
    })
  }

  getFilterLinks = () => {
    const { currentReport, selectedCategory, dateRange, atBatchLevel } = this.state
    let filterLinks = []
    const currentCategory = selectedCategory || 'All Categories'
    if (currentReport === 'consumption' || currentReport === 'expired') {
      filterLinks.push({ filter: 'dates', name: dateRange.name })
      if (currentReport === 'consumption') {
        filterLinks.push({ filter: 'categories', name: currentCategory })
        filterLinks.push({ filter: 'batch', name: atBatchLevel ? 'At Batch Level' : 'At Item Level' })
      }
    }
    return filterLinks
  }

  onClickDownload = (event) => {
    event.preventDefault()
    const filters = this.getFilterLinks()
    const { currentReport, displayHeaders, displayRows } = this.state
    let fileName = REPORT_TYPES.find(report=> report.slug === currentReport).name
    fileName += filters.reduce((fileName, filter) => {
      fileName += ' ' + filter.name
      return fileName
    }, '')
    download(displayRows, displayHeaders, fileName)
  }

  render () {
    const { categories } = this.props.alldocs
    const alldocsLoaded = this.props.alldocs.initialRequestComplete
    const locationsLoaded = this.props.locations.initialRequestComplete
    const { dbName } = this.props.route
    const {
      currentReport,
      displayRows,
      displayHeaders,
      openFilter
    } = this.state

    if (!alldocsLoaded || !locationsLoaded) return (<div className='loader' />)

    const filterLinks = this.getFilterLinks()

    return (
      <div className='reports-page'>
        <h6 className='text-center'>
          {REPORT_TYPES.map((report, i) => {
            const activeClass = (report.slug === currentReport) ? 'disabled-link' : ''
            return (
              <span key={i}>
                {(i !== 0) && (<span> | </span>)}
                <a
                  href='#'
                  className={activeClass}
                  onClick={this.onClickReportLink}
                  data-report-type={report.slug}>
                    {report.name}
                </a>
              </span>
            )
          })}
        </h6>
        <hr />
        <div className='text-center filter-toggles'>
          {filterLinks.map((link, i) => {
            const classes = link.filter === openFilter ? 'disabled-link' : null
            return (
              <span key={i}>
                {(i !== 0) && (<span> | </span>)}
                <a
                  href='#'
                  className={classes}
                  onClick={this.onFilterClick}
                  data-filter={link.filter}>
                    {link.name}
                </a>
              </span>
            )
          })}
        </div>
        {openFilter === 'dates' && (
          <DateFilters dates={DATE_FILTERS} onSelect={this.onDateRangeChange} />
        )}
        {openFilter === 'categories' && (
          <CategoryFilteres categories={categories} onSelect={this.onCategoryFilterChange} />
        )}
        <div className='report'>
          <div className='pull-right'>
            <a href='#' onClick={this.onClickDownload}>Download</a>
            <span>Rows: {h.num(displayRows.length)}</span>
          </div>
          <ReportTable dbName={dbName} headers={displayHeaders} rows={displayRows} />
        </div>
      </div>
    )
  }
}

export default connect(
  state => {
    return {
      alldocs: state.alldocs,
      locations: state.locations
    }
  },
  { getAllDocs, getLocations }
)(ReportsPage)
