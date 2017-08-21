import {isNumeric, empty, isNumber} from 'utils'
import Moment from 'moment'

export const isISODate = (d) => {
  if (!d) {
    return false
  } else {
    const isoDateSplit = d.split('.')
    return ((isoDateSplit.length === 2) && Moment(isoDateSplit[0], 'YYYY-MM-DDTHH:mm:ss', true).isValid())
  }
}

export const dateIsValid = (inputValue) => {
  if (!inputValue) {
    return false
  } else if (inputValue[0].toLowerCase() === 't') {
    if (inputValue.length === 1) {
      return true
    }
    else if (inputValue.length !== 1) {
      if (inputValue[1] === '-') {
        return (inputValue.split('-').length === 2 && isNumeric(inputValue.split('-')[1]))
      } else if (inputValue[1] === '+') {
        return (inputValue.split('+').length === 2 && isNumeric(inputValue.split('+')[1]))
      } else {
        return false
      }
    }
  } else {
    return (Moment(inputValue, 'YYYY-M-D', true).isValid())
  }
}

export const expirationIsValid = (input) => {
  if (!input) {
    return true
  } else if (Moment(input, 'M/YY', true).isValid() ||
    Moment(input, 'MM/YY', true).isValid() ||
    Moment(input, 'M/YYYY', true).isValid() ||
    Moment(input, 'MM/YYYY', true).isValid() ||
    Moment(input, 'YYYY-M-D', true).isValid()) {
    return true
  } else {
    return false
  }
}

// '4', 4, and null are OK
export const numberInputIsValid = (input) => {
  if (!input) {
    return true
  } else {
    return !isNaN(parseFloat(input)) && isFinite(input)
  }
}

export const isPresent = (input) => {
  return (input)
}

export const isPresentAndNumber = (input) => {
  return isPresent(input) && numberInputIsValid(input)
}

export const transactionIsValid = (transaction) => {
  // TODO: add username
  const {item, category, quantity, exipration, unitPrice} = transaction
  return (!item || !category || !quantity ||
    !numberInputIsValid(quantity) || !numberInputIsValid(unitPrice) || expirationIsValid(exipration))
}

export const validateShipment = (shipment) => {
  let isValid = true
  const validationErrors = []
  const validLocationTypes = ['E', 'EV', 'I', 'P']

  if (!shipment.date || empty(shipment.from)
  || empty(shipment.to) || empty(shipment.fromType)
  || empty(shipment.toType)) {
    isValid = false
    validationErrors.push('Invalid shipment: missing properties')
  }

  if (validLocationTypes.indexOf(shipment.fromType) === -1 || validLocationTypes.indexOf(shipment.toType) === -1) {
    isValid = false
    validationErrors.push('Invalid shipment: location type is not one of "E" "EV" "I" or "I"')
  }

  if (shipment.to === shipment.from) {
    isValid = false
    validationErrors.push('Invalid shipment: to location cannot be the same as from')
  }

  if (!isISODate(shipment.date)) {
    isValid = false
    validationErrors.push('Invalid shipment: date must be an ISO string')
  }

  if (shipment.toType === 'I' && shipment.to[0] !==  shipment.to[0].toLowerCase()) {
    isValid = false
    validationErrors.push('Invalid shipment: internal locations must be lower case, to location is not lower case')
  }

  if (shipment.fromType === 'I' && shipment.from[0] !==  shipment.from[0].toLowerCase()) {
    isValid = false
    validationErrors.push('Invalid shipment: internal locations must be lower case, from location is not lower case')
  }

  let transactionError = null
  shipment.transactions.forEach(transaction => {
    transactionError = validateTransaction(transaction)
    if (transactionError) {
      isValid = false
      validationErrors.push(transactionError)
    }
  })

  return {isValid, validationErrors}

}

export const validateTransaction = (transaction) => {
  if (!transaction.item || !transaction.category) {
    return 'Invalid transaction: missing properties'
  }
  if (!isNumber(transaction.quantity)) {
    return 'Invalid transaction: quantity must be a number'
  }
  if (!isNumeric(transaction.quantity)) {
    return 'Quantity must be numeric'
  }
  if (transaction.quantity < 1) {
    return 'Quantity must be positive'
  }
  if (transaction.unitPrice && !isNumber(transaction.unitPrice)) {
    return 'Invalid transaction: unit price must be a number'
  }
  if (transaction.expiration && !isISODate(transaction.expiration)) {
    return 'Invalid transaction: expiration must be in ISO format'
  }
}
