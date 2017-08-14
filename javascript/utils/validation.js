import {isNumeric} from 'utils'
import Moment from 'moment'

export const dateIsValid = (inputValue) => {
  if (!inputValue) {
    return true
  } else if (inputValue[0].toLowerCase() === 't') {
    if (inputValue.length !== 1) {
      if (inputValue[1] !== '-' && inputValue[1] !== '+') {
        return true
      } else if (!isNumeric(inputValue[2])) {
        return true
      }
    }
  } else if (!Moment(inputValue, 'YYYY-M-D', true).isValid()) {
    return true
  } else {
    return false
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
