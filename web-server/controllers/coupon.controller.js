const couponService = require('../services/coupon.service');

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.status(200).json({
      data: coupons,
      message: 'Lấy danh sách coupon thành công!',
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

const getCouponById = async (req, res) => {
  try {
    const coupon = await couponService.getCouponById(req.params.id);
    if (!coupon) {
      return res.status(404).json({
        message: 'Không tìm thấy coupon!',
        code: 0,
      });
    }
    res.status(200).json({
      data: coupon,
      message: 'Lấy coupon thành công!',
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

const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(200).json({
      data: coupon,
      message: 'Tạo coupon thành công!',
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

const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.status(200).json({
      data: coupon,
      message: 'Cập nhật coupon thành công',
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

const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.status(200).json({
      message: 'Xóa coupon thành công!',
      code: 1,
    });
  } catch (error) {
    console.log('Lỗi controller', error);
    res.status(500).json({
      message: 'Lỗi máy chủ!',
      code: 0,
    });
  }
};
module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
