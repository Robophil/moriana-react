import Moment from 'moment'

export default {
  dateFromNow (date) {
    if (!date) {
      return ''
    } else {
      return Moment(date).fromNow()
    }
  },

  formatDate (date) {
    if (!date) return date
    // awful: http://stackoverflow.com/questions/7556591/javascript-date-object-always-one-day-off
    /* eslint-disable */
    return Moment(new Date(date.replace(/-/g, '\/').replace(/T.+/, ''))).format('LL')
    /* eslint-enable */
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

  num (num) {
    if (typeof num !== 'number') return num
    return ('' + (Math.round(num * 100) / 100)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  },

  percent (first, second) {
    return Math.floor(first / second * 100) + '%'
  },

  currency (amount) {
    if ((amount) && Number(amount)) {
      return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    } else {
      return '0.0'
    }
  },

  capitalize (name) {
    if (!name || typeof (name) !== 'string') return name
    const words = name.split(' ').map(word => {
      const letters = word.split('')
      letters[0] = letters[0].toUpperCase()
      return letters.join('')
    })
    return words.join(' ')
  },

  expiration (exp) {
    if (!exp) return ''
    const momentDate = Moment(exp)
    if (momentDate.isValid()) {
      momentDate.add('15', 'days')
      return momentDate.format('MM/YYYY')
    } else {
      return ''
    }
  },

  keyMap (keyCode) {
    const keys = {
      13: 'ENTER',
      27: 'ESCAPE',
      38: 'ARROW_UP',
      40: 'ARROW_DOWN',
      191: 'FORWARD_SLASH'
    }
    return keys[keyCode]
  }

}
