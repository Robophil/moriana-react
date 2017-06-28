import Moment from 'moment'

export default {
  dateFromNow (date) {
    return Moment(date).fromNow()
  },

  soronos (number) {
    return (number === 1) ? '' : 's'
  },

  json (input) {
    if (typeof input === 'string') {
      return input
    } else {
      return JSON.stringify(input, null, 2)
    }
  },

  removeExtraWhiteSpace (s) {
    return s ? s.replace(/\s+/g, ' ').trim() : ''
  },

  isEmpty (input) {
    if (!input) return true
    const s = this.removeExtraWhiteSpace(input)
    return (s === '')
  },

  isValidateEmail (email) {
    /* eslint-disable no-useless-escape */
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    /* eslint-enable no-useless-escape */
    return re.test(email)
  },

  num (num) {
    if (typeof num !== 'number') return num
    return ('' + (Math.round(num * 100) / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  percent (first, second) {
    return Math.floor(first / second * 100) + '%'
  },

  first (list) {
    if (!list || !list.length) {
      return {}
    } else {
      return list[0]
    }
  }

}
