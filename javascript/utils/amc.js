import Moment from 'moment'

export const getAMCDetails = (rawTransactions, locations) => {
  const transactions = mergeLocationAttributesIntoTransactions(rawTransactions, locations)
  const monthSums = getQuantitySumsByMonth(transactions)
  const byYear = byYearByMonth(monthSums)
  const amcSixMonths = getAMCByMonths(transactions, 6)
  const amcTwelveMonths = getAMCByMonths(transactions, 12)
  const {min, max} = getMinAndMaxOnMonths(monthSums)
  return {
    byYear,
    amcSixMonths,
    amcTwelveMonths,
    min,
    max
  }
}

// don't count receive transactions (positive) or locations excluded from consumption, including Expired
const mergeLocationAttributesIntoTransactions = (transactions, locations) => {
  const locationsByExcludedFromConsumption = locations.reduce((memo, l) => {
    if (l.attributes && l.attributes.excludeFromConsumption || l.type === 'EV') {
      memo[l.name] = true
    }
    return memo
  }, {})
  return transactions.map(t => {
    if (locationsByExcludedFromConsumption[t.to]) {
      t.toExcludedFromConsumption = true
    }
    return t
  })
}

// build array of [ { month: 2012-01, quantity: 34 }, ...]
const getQuantitySumsByMonth = (transactions) => {
  const monthsHash = transactions.reduce((monthsHash, t) => {
    if (!includedInConsumption(t)) {
      return monthsHash
    }
    const month = t.date.substring(0, [t.date.lastIndexOf('-')])
    monthsHash[month] = monthsHash[month] || 0
    monthsHash[month] += -1 * t.quantity
    return monthsHash
  }, {})
  return Object.keys(monthsHash).map(key => { return { month: key, quantity: monthsHash[key] } })
}

// build array of [ { year: 2012, months: { 01: 34, 02: } }, { year: 2012, months: {} }... ]
const byYearByMonth = (monthSums) => {
  const byYear = monthSums.reduce((byYear, month) => {
    const monthSplit = month.month.split('-')
    const year = monthSplit[0]
    byYear[year] = byYear[year] || {}
    byYear[year][monthSplit[1]] = month.quantity
    return byYear
  }, {})

  // make our hash into a list & sort ascending
  return Object.keys(byYear).map(key => {
    return { year: key, months: byYear[key] }
  })
  .sort(yearObject => yearObject.year)
}

const getMinAndMaxOnMonths = (monthSums) => {
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
}

const getAMCByMonths = (transactions, numberOfMonths, upUntilDate) => {
  if (!numberOfMonths) return 0
  upUntilDate = upUntilDate ? Moment(upUntilDate) : Moment()
  const earliestMonth = upUntilDate.clone().subtract(numberOfMonths, 'months')
  const upUntilDateISO = upUntilDate.toISOString()
  const earliestMonthISO = earliestMonth.toISOString()
  const sum = transactions.reduce((memo, t) => {
    if (includedInConsumption(t) && (t.date <= upUntilDateISO && t.date >= earliestMonthISO)) {
      memo += t.quantity
    }
    return memo
  }, 0)
  return Math.round(Math.abs(sum) / numberOfMonths)
}

const includedInConsumption = (t) => {
  return (t.quantity < 0 && !t.toExcludedFromConsumption)
}
