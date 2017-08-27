function isPlainObject(object) {
  return object && object.constructor && object.constructor.name === 'Object';
}

function mergeDeep(destination, source) {
  for (var property in source) {
    if (isPlainObject(destination[property]) && isPlainObject(source[property])) {
      destination[property] = destination[property] || {};
      mergeDeep(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

module.exports = mergeDeep;
