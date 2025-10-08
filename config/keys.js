/* eslint-disable global-require */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line node/no-unpublished-require
  module.exports = require('./dev');
} else {
  // eslint-disable-next-line node/no-unpublished-require
  module.exports = require('./local');
}
