import Moment from 'moment'

export default {
  getAMCDetails (transactions) {
    const monthSums = this.getQuantitySumsByMonth(transactions)
    const byYear = this.byYearByMonth(monthSums)
    const amcSixMonths = this.getAMCByMonths(transactions, 6)
    const amcTwelveMonths = this.getAMCByMonths(transactions, 12)
    const {min, max} = this.getMinAndMaxOnMonths(monthSums)
    return {
      byYear,
      amcSixMonths,
      amcTwelveMonths,
      min,
      max,
    }
  },

  // build array of [ { month: 2012-01, quantity: 34 }, ...]
  getQuantitySumsByMonth (transactions) {
    const monthsHash = transactions.reduce((monthsHash, t) => {
      // don't count receive transactions (positive) or locations excluded from consumption, including Expired
      if (t.toType === 'EV' || t.quantity > 0 ||  (t.toAttributes && t.toAttributes.excludeFromConsumption)) {
        return monthsHash
      }
      const month = t.date.substring(0, [t.date.lastIndexOf('-')])
      monthsHash[month] = monthsHash[month] || 0
      monthsHash[month] += -1 * t.quantity
      return monthsHash
    }, {})

    return Object.keys(monthsHash).map(key => { return { month: key, quantity: monthsHash[key] } })
  },

  // build array of [ { year: 2012, months: { 01: 34, 02: } }, { year: 2012, months: {} }... ]
  byYearByMonth (monthSums) {
    const byYear = monthSums.reduce((byYear, month) => {
      const monthSplit = month.month.split('-')
      const year = monthSplit[0]
      byYear[year] = byYear[year] || {}
      byYear[year][monthSplit[1]] = month.quantity
      return byYear
    }, {})

    // make our hash into a list & sort ascending
    return Object.keys(byYear).map(key => {
      return { year: key, months: byYear[key]}
    })
    .sort(yearObject => yearObject.year)
  },

  getAMCByMonths (transactions, numberOfMonths, upUntilDate) {
    if (!numberOfMonths) return 0
    upUntilDate = upUntilDate ? Moment(upUntilDate) : Moment()
    const earliestMonth = upUntilDate.clone().subtract(numberOfMonths, 'months')
    const upUntilDateISO = upUntilDate.toISOString()
    const earliestMonthISO = earliestMonth.toISOString()
    const sum = transactions.reduce((memo, t) => {
      if (t.quantity < 0
      && (!t.toAttributes || !t.toAttributes.excludeFromConsumption)
      && (t.date <= upUntilDateISO && t.date >= earliestMonthISO)) {
        memo += t.quantity
      }
      return memo
    }, 0)
    return Math.round(Math.abs(sum) / numberOfMonths)
  },

  getMinAndMaxOnMonths (monthSums) {
    let min = null
    let max = 0
    monthSums.forEach(month => {
      max = month.quantity > max ? month.quantity : max
      // avoid counting inital zero months as min
      if (min === null && month.quantity !== 0) {
        min = month.quantity
      } else if (min > month.quantity) {
        min = month.quantity
      }
    })
    min = (min === null) ? 0 : min
    return { min, max }
  },

  // getMonthsHash () {
  //   const startDate = Moment(config.startDate)
  //   const months = {}
  //   for (let i = 1; i < Moment().diff(startDate, 'months'); i++) {
  //     months[startDate.clone().add(i, 'months').format('YYYY-MM')] = 0
  //   }
  //   return months
  // },

}
