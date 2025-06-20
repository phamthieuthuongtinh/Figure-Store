const { poolPromise } = require('../config/db');

const getAllBrands = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Brands WHERE isDeleted = 0');
  return result.recordset;
};
const getBrandById = async (id) => {
  const pool = await poolPromise;
  const result = (await pool)
    .request()
    .input('brandId', id)
    .query('SELECT * FROM Brands WHERE brandId=@brandId AND isDeleted = 0');
  return (await result).recordset[0];
};
const createBrand = async (data) => {
  const pool = await poolPromise;
  // console.log(typeof data.productPrice, data.productPrice);
  const result = await pool
    .request()
    .input('brandName', data.brandName)
    .input('description', data.description)
    .query(`INSERT INTO Brands (brandName, description)
            OUTPUT INSERTED.* VALUES (@brandName, @description)`);
  return result.recordset[0];
};

const updateBrand = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('brandId', id)
    .input('brandName', data.brandName)
    .input('description', data.description)
    .query(`UPDATE Brands SET brandName = @brandName, description=@description
            OUTPUT INSERTED.*  WHERE brandId = @brandId`);
  return result.recordset[0];
};
const deleteBrand = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('brandId', id)
    .query('UPDATE Brands SET isDeleted = 1 WHERE brandId = @brandId');
};
module.exports = {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  deleteBrand,
};
