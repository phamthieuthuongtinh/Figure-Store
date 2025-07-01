const bannerService = require('../services/banner.service');

const getAllBanners = async (req, res) => {
  try {
    const banners = await bannerService.getAllBanners();
    res.status(200).json({
      data: banners,
      message: 'Lấy danh sách banner thành công!',
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

const getBannerById = async (req, res) => {
  try {
    const banner = await bannerService.getBannerById(req.params.id);
    if (!banner) {
      return res.status(404).json({
        message: 'Không tìm thấy banner!',
        code: 0,
      });
    }
    res.status(200).json({
      data: banner,
      message: 'Lấy banner thành công!',
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

const createBanner = async (req, res) => {
  try {
    const banner = await bannerService.createBanner(req.body);
    res
      .status(201)
      .json({ data: banner, message: 'Tạo banner thành công!', code: 1 });
  } catch (error) {
    res.status(400).json({ message: error.message, code: 0 });
  }
};

const updateBanner = async (req, res) => {
  try {
    const banner = await bannerService.updateBanner(req.params.id, req.body);
    res.status(200).json({
      data: banner,
      message: 'Cập nhật banner thành công',
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

const deleteBanner = async (req, res) => {
  try {
    await bannerService.deleteBanner(req.params.id);
    res.status(200).json({
      message: 'Xóa banner thành công!',
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
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
