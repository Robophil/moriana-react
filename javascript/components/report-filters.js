import React from 'react'

export default class extends React.Component {
  state = { openFilter: null }

  showFilter = (event) => {
    event.preventDefault()
    let selectedFilter = event.target.dataset.filterName
    if (selectedFilter === this.state.openFilter) {
      selectedFilter = null
    }
    this.setState({ openFilter: selectedFilter })
  }

  filterClicked = (event) => {
    this.props.filterSet(event.target.dataset.filterType, event.target.dataset.index)
    this.setState({ openFilter: null })
  }

  render () {
    const { openFilter } = this.state
    const {
      dateFilter, categoryFilter, batchFilter,
      allDateFilters, allCategoryFilters, allBatchFilters
    } = this.props
    const availableFilters = { date: dateFilter, category: categoryFilter, batch: batchFilter }
    return (
      <div className='filters'>
        <div className='links'>
          {Object.keys(availableFilters).map((key, i) => {
            const btnClass = (key === openFilter) ? 'active' : ''
            return (
              <a key={i} href onClick={this.showFilter} data-filter-name={key} className={`${btnClass}`}>
                {availableFilters[key].name}
              </a>
            )
          })}
        </div>
        {this.state.openFilter === 'date' && (
          <div>
            <div className='row dates-filters filters text-center'>
              <br />
              <h5>Select Dates</h5>
              <p className='help-block'>Runs report from the beginning of the day of the start date
                 to the end of the day of the end date.</p>
              <div className='form-group field start-date validate-on-blur text-left'>
                <label className='col-lg-2 control-label'>Start Date</label>
                <div className='col-sm-9 input-group'>
                  <div className='form-control-static hidden'>
                    {/* <span className='static-value'></span> */}
                    (<a href='#' data-fieldname='start-date' className='edit-field text-no-transform'>
                      edit</a>)
                  </div>
                  <input className='form-control form-input ' type='text' data-fieldname='start-date' />
                  {/* <p className='error help-block hidden'></p> */}
                </div>
              </div>
              <div className='form-group field end-date validate-on-blur text-left'>
                <label className='col-lg-2 control-label'>End Date</label>
                <div className='col-sm-9 input-group'>
                  <div className='form-control-static hidden'>
                    {/* <span className='static-value'></span> */}
                    (<a href='#' data-fieldname='end-date' className='edit-field text-no-transform'>
                      edit</a>)
                  </div>
                  <input className='form-control form-input ' type='text' data-fieldname='end-date' />
                  {/* <p className='error help-block hidden'></p> */}
                </div>
              </div>
              <button className='btn btn-default date-range-select'>Run Dates</button>
              <br /><br />
              <p className='help-block'>Or select a month:</p>
            </div>
            <div className='row text-center dates-filters filters'>
              <br />
              {allDateFilters.map((month, i) => (
                <button
                  onClick={this.filterClicked}
                  key={i}
                  data-index={i}
                  className='col-md-3 filter btn btn-default'
                  data-filter-type='dates'>
                  {month.name}
                </button>
              ))}
            </div>
          </div>
        )}
        {this.state.openFilter === 'category' && (
          <div className='row text-center categories-filters filters'>
            <br />
            {allCategoryFilters.map((cat, i) => (
              <button
                onClick={this.filterClicked}
                key={i}
                data-index={i}
                className='col-md-3 filter btn btn-default'
                data-filter-type='categories'>
                {cat.name}
              </button>
            ))}
          </div>
        )}
        {this.state.openFilter === 'batch' && (
          <div className='row text-center batches-filters filters'>
            <br />
            {allBatchFilters.map((b, i) => (
              <button
                onClick={this.filterClicked}
                key={i}
                data-index={i}
                className='col-md-3 filter btn btn-default'
                data-filter-type='batches'>
                {b.name}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }
}
