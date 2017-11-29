import React from 'react'
import Moment from 'moment'
import h from 'utils/helpers'
import DateInput from 'components/date-input'

export class DateFilters extends React.Component {
  state = { startDate: '', endDate: '', chronologyError: false }

  onFilterChange = (event) => {
    event.preventDefault()
    this.props.onSelect(this.props.dates[event.target.dataset.index])
  }

  onDateChange = (key, value) => {
    const newState = { chronologyError: false }
    newState[key] = value
    this.setState(newState)
  }

  runDates = () => {
    const {startDate, endDate} = this.state
    if (startDate && endDate) {
      if (startDate >= endDate) {
        this.setState({ chronologyError: true })
      } else {
        const name = `${h.formatDate(startDate)} - ${h.formatDate(endDate)}`
        this.props.onSelect({ name, startDate, endDate })
      }
    }
  }

  render () {
    const {dates} = this.props
    const {startDate, endDate, chronologyError} = this.state
    return (
      <div className='text-center'>
        <p className='filter-header'>Select a month:</p>
        {dates.map((month, i) => (
          <a
            onClick={this.onFilterChange}
            href='#'
            key={i}
            data-index={i}>
            {month.name}
          </a>
        ))}
        <p className='filter-header'>Or specific dates:</p>
        <div>
          <div className='row date-inputs'>
            <div className='four columns'>
              <DateInput value={startDate} valueUpdated={this.onDateChange} updateKey='startDate' label='Start Date' />
            </div>
            <div className='four columns'>
              <DateInput value={endDate} valueUpdated={this.onDateChange} updateKey='endDate' label='End Date' />
            </div>
          </div>
          {chronologyError && (<p className='error'>Start date must be before end date.</p>)}
          <button onClick={this.runDates}>Run Dates</button>
        </div>
        <p>Runs report from the beginning of the day of the start date to the end of the day of the end date.</p>
      </div>
    )
  }
}

export class CategoryFilteres extends React.Component {
  onClickCategory = (event) => {
    event.preventDefault()
    const {name} = event.target.dataset
    if (name === 'All Categories') {
      this.props.onSelect(null)
    } else {
      this.props.onSelect(name)
    }
  }

  render () {
    const {categories} = this.props
    return (
      <div className='text-center'>
        <p className='filter-header'>Select a category:</p>
        {categories.map((cat, i) => {
          return (<a
            onClick={this.onClickCategory}
            href='#'
            key={i}
            data-name={cat.name}>
            {cat.name}
          </a>)
        })}
      </div>
    )
  }
}
