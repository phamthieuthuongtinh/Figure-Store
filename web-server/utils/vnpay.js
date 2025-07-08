const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');

const sortObject = (obj) => {
  return Object.keys(obj)
    .sort()
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {});
};

const createSecureHash = (params, secretKey) => {
  const sortedParams = sortObject(params);
  const signData = qs.stringify(sortedParams, { encode: false });
  return crypto
    .createHmac('sha512', secretKey)
    .update(signData, 'utf-8')
    .digest('hex');
};

module.exports = {
  createSecureHash,
  sortObject,
};
