const moment = require('moment');
const crypto = require('crypto');
const qs = require('qs');
const sort = (obj) =>
  Object.keys(obj)
    .sort()
    .reduce((r, k) => ((r[k] = obj[k]), r), {});

function buildVNPayUrl({ orderId, amount, ipAddr }) {
  const {
    VNP_TMNCODE: tmn,
    VNP_HASH_SECRET: secret,
    VNP_URL: apiUrl,
    VNP_RETURN_URL: returnUrl,
  } = process.env;

  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmn,
    vnp_Amount: Math.round(amount) * 100,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: `${orderId}_${Date.now()}`,
    vnp_OrderInfo: `Thanh toan don ${orderId}`,
    vnp_OrderType: 'billpayment',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr === '::1' ? '127.0.0.1' : ipAddr,
    vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
  };

  const sorted = sort(params);
  const signStr = qs.stringify(sorted, { encode: false });
  const secure = crypto
    .createHmac('sha512', secret)
    .update(signStr)
    .digest('hex');

  const final = {
    ...sorted,
    vnp_SecureHashType: 'SHA512',
    vnp_SecureHash: secure,
  };

  return `${apiUrl}?${qs.stringify(final, { encode: false })}`; // ⚠️ KHÔNG encode:false
}
module.exports = { buildVNPayUrl };
