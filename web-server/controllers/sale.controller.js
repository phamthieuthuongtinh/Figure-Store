const saleService = require('../services/sale.service');

const getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.status(200).json({
      data: sales,
      message: 'Lấy danh sách sale thành công!',
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

const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale) {
      return res.status(404).json({
        message: 'Không tìm thấy sale!',
        code: 0,
      });
    }
    res.status(200).json({
      data: sale,
      message: 'Lấy sale thành công!',
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

const createSale = async (req, res) => {
  try {
    const sale = await saleService.createSale(req.body);
    res
      .status(201)
      .json({ data: sale, message: 'Tạo sale thành công!', code: 1 });
  } catch (error) {
    res.status(400).json({ message: error.message, code: 0 });
  }
};

const updateSale = async (req, res) => {
  try {
    const sale = await saleService.updateSale(req.params.id, req.body);
    res.status(200).json({
      data: sale,
      message: 'Cập nhật sale thành công',
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

const deleteSale = async (req, res) => {
  try {
    await saleService.deleteSale(req.params.id);
    res.status(200).json({
      message: 'Xóa sale thành công!',
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
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
