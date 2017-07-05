import helpers from 'helpers'

export default {
  getNamefromDBName (input, deploymentName) {
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
    return helpers.capitalize(name)
  },

  removeDeploymentPrefix (input, deploymentName) {
    if (!input) return ''
    return input.replace(deploymentName + '_', '')
  },

  isDBSafeName(input) {
    if (!input) return false
    // regex from http://docs.couchdb.org/en/1.6.1/api/database/common.html
    // without '/', because that broke things...
    const safeDBNameRegex = /^[a-z][a-z0-9_$()+-]*$/
    return safeDBNameRegex.test(input)
  }

}
