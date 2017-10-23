import config from 'config'
import {removeExtraWhiteSpace} from 'utils'

export default {
  getNamefromDBName (input, deploymentName = config ? config.deploymentName : 'moriana') {
    if (!input || input.indexOf(deploymentName) === -1) return input
    let name = ''
    const inputWithoutPrefix = this.removeDeploymentPrefix(input, deploymentName)
    if (this.isDBSafeName(inputWithoutPrefix)) {
      name = inputWithoutPrefix.replace(/_/g, ' ')
    } else {
      // doesn't handle non bmp characters
      name = inputWithoutPrefix.split('-').map(char => {
        return String.fromCharCode(char)
      })
      name = name.join('')
    }
    return name
  },

  removeDeploymentPrefix (input, deploymentName) {
    if (!input) return ''
    return input.replace(deploymentName + '_', '')
  },

  isDBSafeName (input) {
    if (!input) return false
    // regex from http://docs.couchdb.org/en/1.6.1/api/database/common.html
    // without '/', because that broke things...
    const safeDBNameRegex = /^[a-z][a-z0-9_$()+-]*$/
    return safeDBNameRegex.test(input)
  },

  getDBName (input) {
    const inputWithoutExtraSpaces = removeExtraWhiteSpace(input);
    const spaceEscapedInput = this.escapeSpacesAndLowercase(inputWithoutExtraSpaces);
    // dbname won't be safe if first char is number
    if (this.isDBSafeName(spaceEscapedInput)) {
      return this.addDeploymentPrefix(spaceEscapedInput);
    } else {
      // doesn't handle non bmp characters
      const charCodeName = _.reduce(input.split(''), (memo, char) => {
        if (memo) {
          memo += '-';
        }
        memo += char.charCodeAt(0);
        return memo;
      }, null);
      return this.addDeploymentPrefix(charCodeName);
    }
  },

  escapeSpacesAndLowercase(input) {
    return input.replace(/ /g, '_').toLowerCase();
  },

  addDeploymentPrefix(input) {
    return config.deploymentName + '_' + input;
  }

}
