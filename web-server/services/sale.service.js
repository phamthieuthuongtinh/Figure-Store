// services/sale.service.js
const sql = require('mssql');
const { poolPromise } = require('../config/db');

const validateDate = (start, end) => {
  if (new Date(end) <= new Date(start)) {
    throw new Error('Ngày kết thúc phải sau ngày bắt đầu.');
  }
};

const getAllSales = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Sales ORDER BY createdAt DESC');
  return result.recordset;
};

const getSaleById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('saleId', sql.Int, id)
    .query('SELECT * FROM Sales WHERE saleId = @saleId');
  return result.recordset[0];
};

const createSale = async (data) => {
  validateDate(data.startDate, data.endDate);
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('productId', sql.Int, data.productId)
    .input('title', sql.NVarChar, data.title)
    .input('discountPercent', sql.Int, data.discountPercent)
    .input('startDate', sql.DateTime, data.startDate)
    .input('endDate', sql.DateTime, data.endDate)
    .input('status', sql.Bit, data.status ?? 1).query(`
      INSERT INTO Sales (productId, title, discountPercent, startDate, endDate, status)
      OUTPUT INSERTED.*
      VALUES (@productId, @title, @discountPercent, @startDate, @endDate, @status)
    `);

  return result.recordset[0];
};

const updateSale = async (id, data) => {
  validateDate(data.startDate, data.endDate);
  const pool = await poolPromise;

  const result = await pool
    .request()
    .input('id', sql.Int, id)
    .input('productId', sql.Int, data.productId)
    .input('title', sql.NVarChar, data.title)
    .input('discountPercent', sql.Int, data.discountPercent)
    .input('startDate', sql.DateTime, data.startDate)
    .input('endDate', sql.DateTime, data.endDate)
    .input('status', sql.Bit, data.status).query(`
      UPDATE Sales
      SET productId = @productId,
          title = @title,
          discountPercent = @discountPercent,
          startDate = @startDate,
          endDate = @endDate,
          status = @status,
          updatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE saleId = @id
    `);

  return result.recordset[0];
};

const deleteSale = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('saleId', sql.Int, id)
    .query('DELETE FROM Sales WHERE saleId = @saleId');
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSale,
  deleteSale,
};
