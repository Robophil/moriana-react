import Moment from 'moment'

export default {
  dateFromNow (date) {
    return Moment(date).fromNow()
  },

  formatDate (date) {
    if (!date) return date
    // awful: http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off
    return Moment(new Date(date.replace(/-/g, '\/').replace(/T.+/, ''))).format('LL')
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
  },

  capitalize (name) {
    if (!name || typeof(name) !== 'string') return name
    const words = name.split(' ').map(word => {
      const letters = word.split('')
      letters[0] = letters[0].toUpperCase()
      return letters.join('')
    })
    return words.join(' ')
  },

  expiration (exp) {
    if (!exp) return '';
    const momentDate = Moment(exp)
    if (momentDate.isValid()) {
      momentDate.add('15', 'days')
      return momentDate.format('MM/YYYY')
    } else {
      return ''
    }
  }

}
