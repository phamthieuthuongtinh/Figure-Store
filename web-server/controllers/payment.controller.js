const moment = require('moment');
const qs = require('qs');
const crypto = require('crypto');
const { createOrderDetail } = require('./orderdetail.controller');

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

const createVnpayPayment = (req, res) => {
  const userId = req.user.userId;
  process.env.TZ = 'Asia/Ho_Chi_Minh';

  const date = new Date();
  const createDate = moment(date).format('YYYYMMDDHHmmss');
  const orderId = moment(date).format('DDHHmmss');

  let ipAddr =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket?.remoteAddress ||
    req.connection?.socket?.remoteAddress;

  if (ipAddr === '::1') ipAddr = '127.0.0.1';

  const tmnCode = process.env.VNP_TMNCODE;
  const secretKey = process.env.VNP_HASH_SECRET;
  let vnpUrl = process.env.VNP_URL;
  const returnUrl = process.env.VNP_RETURN_URL;

  const {
    totalPrice,
    bankCode,
    language,
    discountAmount = 0,
    couponId,
    items,
  } = req.body.payload;
  const vnp_IpnUrl = process.env.VNP_IPN_URL;
  const locale = language || 'vn';
  const amount = Math.floor(Number(totalPrice) * 100); // integer only
  const currCode = 'VND';
  const payload = {
    // items,
    couponId,
    discountAmount,
    totalPrice,
    paymentMethod: 'VNPAY',
    userId,
  };
  const encodedPayload = encodeURIComponent(JSON.stringify(payload));
  let vnp_Params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: currCode,
    vnp_TxnRef: orderId,
    vnp_OrderInfo: encodedPayload,
    vnp_OrderType: 'other',
    vnp_Amount: amount.toString(),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    // vnp_IpnUrl: vnp_IpnUrl,
    vnp_CreateDate: createDate,
  };

  if (bankCode) {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);
  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', secretKey);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;
  const redirectUrl = `${vnpUrl}?${qs.stringify(vnp_Params, {
    encode: false,
  })}`;

  // console.log('🔁 returnUrl:', returnUrl);
  // console.log('🔗 URL REDIRECT:', redirectUrl);

  return res.json({ url: redirectUrl });
};

// GET /api/payment/vnpay-return
const vnpayReturn = async (req, res) => {
  // console.log('🔁 Đã vào route vnpayReturn');
  let vnp_Params = { ...req.query };
  const rawPayload = decodeURIComponent(req.query.vnp_OrderInfo);
  let payload;
  try {
    payload = JSON.parse(rawPayload); // 👈 biến payload có cấu trúc như req.body cũ
  } catch (error) {
    return res.status(400).send('Invalid payload in vnp_OrderInfo');
  }
  const secureHash = vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // Sắp xếp tham số
  const sortedParams = sortObject(vnp_Params);

  const secretKey = process.env.VNP_HASH_SECRET;

  const signData = qs.stringify(sortedParams, { encode: false });

  const signed = crypto
    .createHmac('sha512', secretKey)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  if (secureHash === signed) {
    req.body = payload;
    return createOrderDetail(req, res);
  } else {
    res.render('success', { code: '97' });
  }
};
const vnpayIpn = (req, res) => {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  // 👉 Lấy các thông tin quan trọng từ VNPay gửi về
  const orderId = vnp_Params['vnp_TxnRef'];
  const rspCode = vnp_Params['vnp_ResponseCode'];
  const amount = parseInt(vnp_Params['vnp_Amount']) / 100;
  const transactionStatus = vnp_Params['vnp_TransactionStatus'];

  // 👉 Xóa các tham số không dùng để ký
  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // 👉 Sắp xếp params & tạo lại chữ ký
  const sortedParams = sortObject(vnp_Params);
  const signData = qs.stringify(sortedParams, { encode: false });
  const hmac = crypto.createHmac('sha512', process.env.VNP_HASH_SECRET);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');

  // 👉 Mặc định bạn sẽ kiểm tra trong DB đơn hàng theo orderId
  const checkOrderId = true; // TODO: Kiểm tra orderId có tồn tại không
  const checkAmount = true; // TODO: So sánh số tiền với DB

  // 👉 Trạng thái giả định của đơn hàng trong DB:
  // 0 = mới tạo, 1 = đã thanh toán, 2 = thất bại
  const paymentStatus = '0'; // TODO: Truy vấn DB xem trạng thái đơn hàng hiện tại là gì

  // 👉 Bắt đầu xử lý IPN
  if (secureHash === signed) {
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus === '0') {
          if (rspCode === '00' && transactionStatus === '00') {
            // ✅ Thanh toán thành công
            // TODO: Cập nhật trạng thái đơn hàng là đã thanh toán
            return res.status(200).json({ RspCode: '00', Message: 'Success' });
          } else {
            // ❌ Giao dịch thất bại
            // TODO: Cập nhật trạng thái đơn hàng là thất bại
            return res
              .status(200)
              .json({ RspCode: '00', Message: 'Fail transaction' });
          }
        } else {
          return res
            .status(200)
            .json({ RspCode: '02', Message: 'Order already processed' });
        }
      } else {
        return res
          .status(200)
          .json({ RspCode: '04', Message: 'Invalid amount' });
      }
    } else {
      return res
        .status(200)
        .json({ RspCode: '01', Message: 'Order not found' });
    }
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
