import Moment from 'moment'
import clone from 'clone'

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

export const getTransactionFromInput = (inputTransaction) => {
  const t = clone(inputTransaction)
  t.unitPrice = Number(t.unitPrice)
  t.quantity = Number(t.quantity)
  t.expiration = getISOExpirationFromInput(t.expiration) || null
  return t
}

export const mergeTransferQuantityWithStock = (quantity, stock) => {
  let remainingQuantity = quantity ? Number(quantity) : 0
  return stock.map(batch => {
    const t = clone(batch)
    if (remainingQuantity) {
       if (remainingQuantity < t.sum) {
         t.quantity = remainingQuantity
         t.resultingQuantity = t.sum - remainingQuantity
         remainingQuantity = 0
       } else {
         t.quantity = t.sum
         t.resultingQuantity = 0
         remainingQuantity = remainingQuantity - t.sum
       }
    } else {
      t.quantity = 0
      t.resultingQuantity = t.sum
    }
    return t
  })
}

export const getTransferTransactionsFromDisplay = (displayTransactions) => {
  return clone(displayTransactions).filter(t => t.quantity)
}
