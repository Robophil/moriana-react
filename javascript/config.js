import runTests from 'run-tests'

const config = {
  backendUrl: '/',
  deploymentName: 'moriana',
  isLocal: (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('127.0.0.1') !== -1)
}

if (window.location.href.indexOf('localhost:9000') !== -1) {
  setupDevelopment()
}

function setupDevelopment () {
  config.deploymentDomainCount = 1
  config.backendUrl = 'http://localhost:5984/'
  // show tests in console at all times
  runTests()
}

export default config
