import React from 'react'
import h from 'helpers'

export default class extends React.Component {
  state = {
    openFilter: null
  }
  showFilter = (event) => {
    event.preventDefault()
    let selectedFilter = event.target.dataset.filterName
    if (selectedFilter === this.state.openFilter) {
      selectedFilter = null
    }
    this.setState({ openFilter: selectedFilter })
  }
  render () {
    const { openFilter } = this.state
    const { dateFilter, categoryFilter, batchFilter  } = this.props
    const availableFilters = { date: dateFilter, category: categoryFilter, batch: batchFilter }
    return (
      <div>
        <div className='current-filters text-center'>
          {Object.keys(availableFilters).map((key, i) => {
            const btnClass = (key === openFilter) ? 'btn-default' : 'btn-primary'
            return (
              <button key={i} onClick={this.showFilter} data-filter-name={key} className={`btn ${btnClass}`}>
                {availableFilters[key].name}
              </button>
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
                    <span className='static-value'></span>
                    (<a href='#' data-fieldname='start-date' className='edit-field text-no-transform'>
                      edit</a>)
                  </div>
                  <input className='form-control form-input ' type='text' data-fieldname='start-date' />
                  <p className='error help-block hidden'></p>
                </div>
              </div>
              <div className='form-group field end-date validate-on-blur text-left'>
                <label className='col-lg-2 control-label'>End Date</label>
                <div className='col-sm-9 input-group'>
                  <div className='form-control-static hidden'>
                    <span className='static-value'></span>
                    (<a href='#' data-fieldname='end-date' className='edit-field text-no-transform'>
                      edit</a>)
                  </div>
                  <input className='form-control form-input ' type='text' data-fieldname='end-date' />
                  <p className='error help-block hidden'></p>
                </div>
              </div>
              <button className='btn btn-default date-range-select'>Run Dates</button>
              <br /><br />
              <p className='help-block'>Or select a month:</p>
            </div>
            <div className='row text-center dates-filters filters'>
              <br />
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='0'>
                June 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='1'>
                May 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='2'>
                April 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='3'>
                March 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='4'>
                February 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='5'>
                January 2017
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='6'>
                December 2016
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='7'>
                November 2016
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='8'>
                October 2016
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='9'>
                September 2016
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='10'>
                August 2016
              </button>
              <button className='col-md-3 filter btn btn-default' data-filter-type='dates' data-index='11'>
                July 2016
              </button>
            </div>
          </div>
        )}
        {this.state.openFilter === 'category' && (
          <div className='row text-center categories-filters filters'>
            <br />
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='0'>
              All Categories
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='1'>
              ARV'S PREPARATIONS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='2'>
              compassinate use
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='3'>
              Donation
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='4'>
              EndTB
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='5'>
              EYE &amp; EAR PREPARATIONS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='6'>
              FAMILY PLANING PREPARATIONS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='7'>
              FRIDGE-LINE PREPARATIONS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='8'>
              GLC
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='9'>
              HABIT FORMING itemS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='10'>
              INJECTIONS &amp; IV INFUSIONS
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='11'>
              LFDS Pharmacy
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='12'>
              MEDICAL SUPPLIES
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='13'>
              NTP consignment
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='14'>
              SUTURES
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='15'>
              SYRUPS, MIXTURE, SUSPENSIONS ETC
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='16'>
              Tablets and Capsules
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='17'>
              TB Medication
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='categories' data-index='18'>
              TOPICAL CREAM,LOTION,OINTMENT &amp; SOLUTION PREPARATIONS
            </button>
          </div>
        )}
        {this.state.openFilter === 'batch' && (
          <div className='row text-center batches-filters filters'>
            <br />
            <button className='col-md-3 filter btn btn-default' data-filter-type='batches' data-index='0'>
              Filtering at Batch Level
            </button>
            <button className='col-md-3 filter btn btn-default' data-filter-type='batches' data-index='1'>
              Filtering at Item Level
            </button>
          </div>
        )}
      </div>
    )
  }
}
