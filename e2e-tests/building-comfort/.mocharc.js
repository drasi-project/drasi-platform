
const path = require('path');

module.exports = {
  require: [path.resolve(__dirname, 'fixtures/cluster-setup.js')],
  timeout: 10000,
  reporter: 'spec',
};