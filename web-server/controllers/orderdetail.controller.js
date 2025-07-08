const orderDetailService = require('../services/orderdetail.service');
const { createOrder } = require('../services/order.service');
const { clearCart } = require('../services/cart.service');
const getAllOrderDetails = async (req, res) => {
  try {
    const orderDetails = await orderDetailService.getAllOrderDetails();
    res.status(200).json({
      data: orderDetails,
      message: 'Lấy danh sách chi tiết đơn hàng thành công!',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ!',
      code: 0,
    });
  }
};

const getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await orderDetailService.getOrderDetailById(
      req.params.id
    );
    if (!orderDetail) {
      return res.status(404).json({
        message: 'Không tìm thấy chi tiết đơn hàng!',
        code: 0,
      });
    }
    res.status(200).json({
      data: orderDetail,
      message: 'Lấy chi tiết đơn hàng thành công!',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};

const createOrderDetail = async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      items,
      couponId,
      discountAmount = 0,
      totalPrice,
      paymentMethod = 'COD',
    } = req.body;
    if (!items?.length) {
      return res.status(400).json({ message: 'Giỏ hàng trống' });
    }

    const serverTotal =
      items.reduce((sum, i) => sum + i.priceAtTime * i.quantity, 0) -
      discountAmount;
    if (Math.abs(serverTotal - totalPrice) > 10) {
      return res
        .status(400)
        .json({ message: 'Tổng tiền không hợp lệ', code: 0 });
    }
    const order = await createOrder({
      userId,
      totalPrice: serverTotal,
      couponId,
      discountAmount,
      paymentMethod,
    });
    const orderDetail = await orderDetailService.createOrderDetail({
      orderId: order.orderId,
      items,
    });
    res.status(200).json({
      data: orderDetail,
      message: 'Tạo chi tiết đơn hàng thành công!',
      code: 1,
    });
    await clearCart(userId);
  } catch (error) {
    console.error('Lỗi controller', error);
    res.status(500).json({
      message: 'Lỗi máy chủ!',
      code: 0,
    });
  }
};

module.exports = {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
};
