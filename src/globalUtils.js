const mergeJSON = (array) => {
  return array.reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});

  // let result = {};
  // array.forEach((obj) => {
  //   Object.keys(obj).forEach((key) => {
  //     result[key] = obj[key];
  //   });
  // });
  // return result;

};

const deepCopy = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export { mergeJSON, deepCopy };