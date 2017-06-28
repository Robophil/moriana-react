export default {
  getNamefromDBName (input, deploymentName) {
    if (!input || input.indexOf(deploymentName) === -1) return input;
    const inputWithoutPrefix = this.removeDeploymentPrefix(input, deploymentName);
    if (this.isDBSafeName(inputWithoutPrefix)) {
      return inputWithoutPrefix.replace(/_/g, ' ');
    } else {
      // doesn't handle non bmp characters
      const name = _.map(inputWithoutPrefix.split('-'), (char) => {
        return String.fromCharCode(char);
      });
      return name.join('');
    }
  },

  removeDeploymentPrefix (input, deploymentName) {
    if (!input) return '';
    return input.replace(deploymentName + '_', '');
  },

  isDBSafeName(input) {
    if (!input) return false;
    // regex from http://docs.couchdb.org/en/1.6.1/api/database/common.html
    // without '/', because that broke things...
    const safeDBNameRegex = /^[a-z][a-z0-9_$()+-]*$/;
    return safeDBNameRegex.test(input);
  }

}
