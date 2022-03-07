const uuid = require('uuid');

// all hyphens are removed using the replace method
const randomUUIDString = () => uuid.v4().replace(/-/g, '');

module.exports = randomUUIDString;
