// This filters the values of the req.body object and only allows the allowed fields to be altered
module.exports = (object, ...allowedFields) => {
  const filteredObject = Object.keys(object)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = object[key];
      return obj;
    }, {});
  return filteredObject;
};
