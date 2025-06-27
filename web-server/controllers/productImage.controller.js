const productImageService = require('../services/productImage.service');

const getProductImages = async (req, res) => {
  try {
    const images = await productImageService.getProductImages(
      req.params.productId
    );
    res.status(200).json({
      data: images,
      message: 'Lấy danh sách ảnh thành công!',
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

const addProductImageByUrl = async (req, res) => {
  try {
    const productId = req.params.productId;
    const imageUrl = req.body.imageUrl;

    const image = await productImageService.addProductImageByUrl({
      productId,
      imageUrl,
    });

    res.status(200).json({
      data: image,
      message: 'Thêm ảnh thành công',
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
const deleteProductImage = async (req, res) => {
  try {
    await productImageService.deleteProductImage(req.params.id);
    res.status(200).json({
      message: 'Xóa ảnh thành công',
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
module.exports = {
  getProductImages,
  addProductImageByUrl,
  deleteProductImage,
};
