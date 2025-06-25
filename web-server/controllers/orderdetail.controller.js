const orderDetailService = require('../services/orderdetail.service');

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
    const orderDetail = await orderDetailService.createOrderDetail(req.body);
    res.status(200).json({
      data: orderDetail,
      message: 'Tạo chi tiết đơn hàng thành công!',
      code: 1,
    });
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
