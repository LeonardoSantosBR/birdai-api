/* eslint-disable @typescript-eslint/no-unsafe-return */
export function transformObject(inputObj) {
  return Object.entries(inputObj).reduce((acc, [key, value]) => {
    const keys = key.split('.');
    keys.reduce((nestedObj, k, idx) => {
      if (idx === keys.length - 1) {
        nestedObj[k] = value;
      } else {
        if (!nestedObj[k]) nestedObj[k] = {};
      }
      return nestedObj[k];
    }, acc);
    return acc;
  }, {});
}
