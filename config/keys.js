/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  // eslint-disable-next-line node/no-unpublished-require
  module.exports = require('./dev');
}
