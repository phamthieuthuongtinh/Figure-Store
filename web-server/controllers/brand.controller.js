const brandService = require('../services/brand.service');

const getAllBrands = async (req, res) => {
  try {
    const brands = await brandService.getAllBrands();
    res.status(200).json({
      data: brands,
      message: 'Lấy danh sách thương hiệu thành công!',
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

const getBrandById = async (req, res) => {
  try {
    const brand = await brandService.getBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({
        message: 'Không tìm thấy loại!',
        code: 0,
      });
    }
    res.status(200).json({
      data: brand,
      message: 'Lấy thương hiệu thành công!',
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

const createBrand = async (req, res) => {
  try {
    const brand = await brandService.createBrand(req.body);
    res.status(200).json({
      data: brand,
      message: 'Tạo thương hiệu thành công!',
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

const updateBrand = async (req, res) => {
  try {
    const brand = await brandService.updateBrand(req.params.id, req.body);
    res.status(200).json({
      data: brand,
      message: 'Cập nhật thương hiệu thành công',
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

const deleteBrand = async (req, res) => {
  try {
    await brandService.deleteBrand(req.params.id);
    res.status(200).json({
      message: 'Xóa thương hiệu thành công!',
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
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
