const qs = require('qs');
const moment = require('moment');
const crypto = require('crypto');

// --- Sắp xếp
const sortObject = (obj) => {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
};

// --- Tạo chữ ký SHA512
const createSecureHash = (params, secretKey) => {
  const sortedParams = sortObject(params);
  // console.log('sorted===================', sortedParams);
  const signData = qs.stringify(sortedParams, { encode: false });

  // console.log('signData:', signData);
  return crypto
    .createHmac('sha512', secretKey)
    .update(signData, 'utf-8')
    .digest('hex');
};

// --- Controller
const createVnpayPayment = (req, res) => {
  // const ipAddr =
  //   req.headers['x-forwarded-for'] ||
  //   req.connection.remoteAddress ||
  //   req.socket.remoteAddress ||
  //   req.connection?.socket?.remoteAddress;
  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  // 👉 Nếu là IPv6 ::1 thì ép về IPv4
  if (ipAddr === '::1') ipAddr = '127.0.0.1';

  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  const vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;
  const vnp_IpnUrl = process.env.VNP_IPN_URL;
  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('HHmmss');
  const amount = Math.floor(Number(req.body.payload.totalPrice) * 100);

  const bankCode = req.body.payload.bankCode;
  const orderInfo = req.body.orderDescription || 'Thanh toan don hang';
  const orderType = req.body.orderType || 'other';
  const locale = req.body.language || 'vn';

  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: orderType,
    vnp_Amount: amount.toString(), // 🚨 phải là chuỗi số nguyên, không dấu chấm
    vnp_ReturnUrl: returnUrl,
    // vnp_IpnUrl: vnp_IpnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };

  if (typeof bankCode !== 'undefined' && bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  // 👉 Bước 1: sắp xếp params để ký
  const sortedParams = sortObject(vnp_Params);

  // 👉 Bước 2: tạo chữ ký từ params đã sắp xếp
  const secureHash = createSecureHash(sortedParams, secretKey);

  // 👉 Bước 3: thêm chữ ký vào params đã sắp xếp
  sortedParams['vnp_SecureHash'] = secureHash;

  // 👉 Bước 4: stringify & encode để redirect
  const redirectUrl = `${vnpUrl}?${qs.stringify(sortedParams, {
    encode: true,
  })}`;
  // 🧾 Log để kiểm tra
  // console.log('🔁 returnUrl:', returnUrl);

  // console.log('🧾 DỮ LIỆU GỬI VNPay:', sortedParams);
  // console.log('🔗 URL REDIRECT:', redirectUrl);

  return res.json({ url: redirectUrl });
};
// GET /api/payment/vnpay-return
const vnpayReturn = async (req, res) => {
  console.log('🔁 Đã vào route vnpayReturn');
  console.log('🧾 Tham số trả về:', req.query);
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];
  console.log('vnp_Params', vnp_Params);
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const secretKey = process.env.VNP_HASH_SECRET;
  const signed = createSecureHash(vnp_Params, secretKey);

  console.log('🔐 Chữ ký VNPay gửi về:', secureHash);
  console.log('🔏 Chữ ký backend tự tạo:', signed);
  if (secureHash === signed) {
    return res.render('success', { code: vnp_Params['vnp_ResponseCode'] });
  } else {
    return res.render('success', { code: '97' }); // 97 = checksum failed
  }
};
const vnpayIpn = (req, res) => {
  const vnp_Params = { ...req.query };
  const secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  const secretKey = process.env.VNP_HASH_SECRET;
  const signed = createSecureHash(vnp_Params, secretKey);

  if (secureHash === signed) {
    // ✅ Ghi log ra DB trạng thái vnp_TransactionStatus (00 = thành công)
    // 👉 Bạn nên cập nhật đơn hàng ở đây

    return res.status(200).json({ RspCode: '00', Message: 'Success' });
  } else {
    return res
      .status(200)
      .json({ RspCode: '97', Message: 'Invalid signature' });
  }
};

module.exports = {
  createVnpayPayment,
  vnpayReturn,
  vnpayIpn,
};
