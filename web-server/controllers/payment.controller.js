const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const { buildVNPayUrl } = require('../utils/vnpay');
const createVnpayPayment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, totalPrice } = req.body.payload;
    //  Tạo Order + OrderDetails (tương tự COD)
    // const order = await createOrder({
    //   userId,
    //   totalPrice,
    //   paymentMethod: 'VNPAY',
    //   status: 'pending',
    // });
    // await orderDetailService.createOrderDetail({
    //   orderId: order.orderId,
    //   items,
    // });

    // link VNPAY

    const fakeOrderId = 'test_' + Date.now();

    const rawIp =
      req.headers['x-forwarded-for']?.split(',')[0] ||
      req.connection?.remoteAddress ||
      req.socket?.remoteAddress ||
      req.ip ||
      '127.0.0.1';

    const paymentUrl = buildVNPayUrl({
      orderId: fakeOrderId,
      amount: totalPrice,
      ipAddr: rawIp === '::1' ? '127.0.0.1' : rawIp,
    });

    return res.status(200).json({ url: paymentUrl });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: 'Lỗi tạo thanh toán VNPAY' });
  }
};

const vnpayReturn = async (req, res) => {
  // verify checksum ...
  const orderId = req.query.vnp_TxnRef.split('_')[0];
  await updateOrderStatus(orderId, {
    paymentStatus: 'paid',
    status: 'confirmed',
    paymentTime: new Date(),
  });
  res.redirect('http://localhost:3001/cart');
};
module.exports = {
  createVnpayPayment,
  vnpayReturn,
};
