function appendPropertyByLookup(objects, lookupReferenceKey, newKey, lookup) {
  objects.forEach((object) => {
    const reference = object[lookupReferenceKey];
    object[newKey] = lookup[reference] || 0;
  });
  return objects;
}

module.exports = appendPropertyByLookup;
