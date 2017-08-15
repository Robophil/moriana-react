import Moment from 'moment'

export const getISODateFromInput = (inputDate) => {
  let date = null
  if (inputDate.toLowerCase()[0] === 't') {
    if (inputDate.split('-').length > 1) {
      date = Moment().subtract(inputDate.split('-')[1], 'days')
    } else if (inputDate.split('+').length > 1) {
      date = Moment().add(inputDate.split('+')[1], 'days')
    } else {
      date = new Date()
    }
  } else {
    date = new Date(inputDate)
  }
  return date.toISOString()
}

export const getISOExpirationFromInput = (input) => {
  if (!input) return
  let value
  const inputSplit = input.split('/')
  if (inputSplit.length === 2) {
    // need to pad 1/2015 with 01/2015 to make 2015-01 else JS new Date does weird things
    const month = (inputSplit[0].length < 2) ? '0' + inputSplit[0] : inputSplit[0]
    let year = inputSplit[1]
    if (year.length === 2) {
      year = '20' + year
    }
    value = new Date(`${year}-${month}`).toISOString()
  } else {
    value = new Date(input).toISOString()
  }
  return value
}

export const getTransactionFromInput = (input, username = null) => {
  // TODO: add username
  let { item, category, quantity, expiration, lot, unitPrice } = input
  quantity = Number(quantity)
  expiration = getISOExpirationFromInput(expiration) || null
  lot = lot || null
  let totalValue = 0
  if (unitPrice) {
    unitPrice = Number(unitPrice)
    totalValue = unitPrice * quantity
  } else {
    unitPrice = null
  }
  return { item, category, quantity, expiration, lot, unitPrice, totalValue, username }
}
