// ./deployment_configs.js should have:
module.exports = {
  dev: {
    appDatabase: 'moriana',
    appDesignDoc: 'moriana3'
  }
};

// ./deployment_credentials.js should have:
module.exports = {
  dev: {
    username: 'admin',
    password: 'pass',
    url: 'http://localhost:5984/'
  }
};

// note trailing slash on URL
