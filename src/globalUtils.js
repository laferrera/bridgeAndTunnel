const mergeJSON = (array) => {
  return array.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});
};

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export { mergeJSON, deepCopy };