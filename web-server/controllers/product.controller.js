const productService = require('../services/product.service');

const getAllProducts = async (req, res) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({
      data: products,
      message: 'Lấy tất cả sản phẩm thành công',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm',
        code: 0,
      });
    }
    res.json({
      data: product,
      message: 'Lấy sản phẩm thành công',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};

const getProductByCategoryId = async (req, res) => {
  try {
    const product = await productService.getProductByCategoryId(req.params.id);
    if (!product) {
      return res.status(404).json({
        message: 'Không tìm thấy sản phẩm',
        code: 0,
      });
    }
    res.json({
      data: product,
      message: 'Lấy sản phẩm thành công',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(200).json({
      data: product,
      message: 'Tạo sản phẩm thành công',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
      data: product,
      message: 'Cập nhật sản phẩm thành công',
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
const deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.params.id);
    res.status(200).json({
      message: 'Xóa sản phẩm thành công',
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

const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await productService.getFlashSaleProducts();
    res.status(200).json({
      data: products,
      message: 'Lấy tất cả sản phẩm giảm giá thành công',
      code: 1,
    });
  } catch (error) {
    console.error('Lỗi controller:', error);
    res.status(500).json({
      message: 'Lỗi máy chủ',
      code: 0,
    });
  }
};
module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFlashSaleProducts,
  getProductByCategoryId,
};
