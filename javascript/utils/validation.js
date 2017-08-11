import {isNumeric} from 'utils'
import Moment from 'moment'

export const validateDateInput = (inputValue) => {
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
