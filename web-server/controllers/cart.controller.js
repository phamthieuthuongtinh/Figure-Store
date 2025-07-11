const cartService = require('../services/cart.service');

const getMyCart = async (req, res) => {
  try {
    const items = await cartService.getCartItems(req.user.userId);
    res.json({ code: 1, message: 'Lấy giỏ hàng thành công', data: items });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ code: 0, message: err.message || 'Lỗi server' });
  }
};

const addItem = async (req, res) => {
  try {
    const added = await cartService.addItem(req.user.userId, req.body);

    res.status(201).json({ code: 1, message: 'Đã thêm vào giỏ', data: added });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ code: 0, message: err.message || 'Lỗi server' });
  }
};

const updateItemQty = async (req, res) => {
  try {
    await cartService.updateItemQty(
      req.user.userId,
      req.params.id, // đây là cartItemId
      req.body.quantity
    );
    res.json({ code: 1, message: 'Đã cập nhật số lượng', data: null });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ code: 0, message: err.message || 'Lỗi server' });
  }
};

const deleteItem = async (req, res) => {
  try {
    await cartService.deleteItem(req.user.userId, req.params.id); // id = cartItemId
    res.json({ code: 1, message: 'Đã xoá khỏi giỏ', data: null });
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ code: 0, message: err.message || 'Lỗi server' });
  }
};
const syncCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const items = req.body.localCart;
    // console.log('controller', items);
    await cartService.syncCart(userId, items);

    return res.json({ code: 1, message: 'Đồng bộ giỏ hàng thành công' });
  } catch (err) {
    console.error('Cart sync error:', err);
    return res
      .status(err.statusCode || 500)
      .json({ code: 0, message: err.message || 'Internal Server Error' });
  }
};
module.exports = {
  getMyCart,
  addItem,
  updateItemQty,
  deleteItem,
  syncCart,
};
