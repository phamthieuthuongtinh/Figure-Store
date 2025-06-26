const userService = require('../services/user.service');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      data: users,
      message: 'Lấy danh sách user thành công!',
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

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: 'Không tìm thấy user!',
        code: 0,
      });
    }
    res.status(200).json({
      data: user,
      message: 'Lấy user thành công!',
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

const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(200).json({
      data: user,
      message: 'Tạo user thành công!',
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

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.status(200).json({
      data: user,
      message: 'Cập nhật user thành công',
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

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.status(200).json({
      message: 'Xóa user thành công!',
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
const loginUser = async (req, res) => {
  try {
    const result = await userService.loginUser(req.body);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};
module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
