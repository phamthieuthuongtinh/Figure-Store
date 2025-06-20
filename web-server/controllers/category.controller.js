const categoryService = require('../services/category.service');

const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
      data: categories,
      message: 'Lấy danh sách loại thành công!',
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

const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({
        message: 'Không tìm thấy loại!',
        code: 0,
      });
    }
    res.status(200).json({
      data: category,
      message: 'Lấy loại thành công!',
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

const createCategory = async (req, res) => {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(200).json({
      data: category,
      message: 'Tạo loại thành công!',
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

const updateCategory = async (req, res) => {
  try {
    const category = await categoryService.updateCategory(
      req.params.id,
      req.body
    );
    res.status(200).json({
      data: category,
      message: 'Cập nhật loại thành công',
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

const deleteCategory = async (req, res) => {
  try {
    await categoryService.deleteCategory(req.params.id);
    res.status(200).json({
      message: 'Xóa loại thành công!',
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
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
