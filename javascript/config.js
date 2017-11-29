import runTests from 'run-tests'

const config = {
  backendUrl: '/',
  deploymentName: 'moriana',
  isLocal: (window.location.href.indexOf('localhost') !== -1 || window.location.href.indexOf('127.0.0.1') !== -1)
}

if (process.env.NODE_ENV === 'development') {
  config.backendUrl = 'http://localhost:5984/'
  runTests()
}

export default config
