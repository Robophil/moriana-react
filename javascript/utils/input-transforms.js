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
