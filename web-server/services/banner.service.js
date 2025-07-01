const sql = require('mssql');
const { poolPromise } = require('../config/db');

const getAllBanners = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Banners ORDER BY createdAt DESC');
  return result.recordset;
};

const getBannerById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('bannerId', sql.Int, id)
    .query('SELECT * FROM Banners WHERE bannerId = @bannerId');
  return result.recordset[0];
};

const createBanner = async (data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('imageUrl', sql.NVarChar, data.imageUrl)
    .input('title', sql.NVarChar, data.title)
    .input('link', sql.NVarChar, data.link)
    .input('displayOrder', sql.Int, data.displayOrder)
    .input('status', sql.Bit, data.status ?? 1).query(`
      INSERT INTO Banners (imageUrl, title, link, displayOrder, status)
      OUTPUT INSERTED.*
      VALUES (@imageUrl, @title, @link, @displayOrder, @status)
    `);

  return result.recordset[0];
};

const updateBanner = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('bannerId', sql.Int, id)
    .input('imageUrl', sql.NVarChar, data.imageUrl)
    .input('title', sql.NVarChar, data.title)
    .input('link', sql.NVarChar, data.link)
    .input('displayOrder', sql.Int, data.displayOrder)
    .input('status', sql.Bit, data.status).query(`
      UPDATE Banners
      SET imageUrl = @imageUrl,
          title = @title,
          link = @link,
          displayOrder = @displayOrder,
          status = @status,
          updatedAt = GETDATE()
      OUTPUT INSERTED.*
      WHERE bannerId = @bannerId
    `);

  return result.recordset[0];
};

const deleteBanner = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('bannerId', sql.Int, id)
    .query('DELETE FROM Banners WHERE bannerId = @bannerId');
};

module.exports = {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
};
