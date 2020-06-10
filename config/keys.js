const devKeys = require('./dev');
const prodKeys = require('./prod');

if (process.env.NODE_ENV === 'production') {
  module.exports = prodKeys;
} else if (process.env.NODE_ENV === 'development') {
  module.exports = devKeys;
}
