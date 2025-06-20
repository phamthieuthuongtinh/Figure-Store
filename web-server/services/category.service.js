const { poolPromise } = require('../config/db');

const getAllCategories = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Categories WHERE isDeleted = 0');
  return result.recordset;
};
const getCategoryById = async (id) => {
  const pool = await poolPromise;
  const result = (await pool)
    .request()
    .input('categoryId', id)
    .query(
      'SELECT * FROM Categories WHERE categoryId=@categoryId AND isDeleted = 0'
    );
  return (await result).recordset[0];
};
const createCategory = async (data) => {
  const pool = await poolPromise;
  // console.log(typeof data.productPrice, data.productPrice);
  const result = await pool
    .request()
    .input('categoryName', data.categoryName)
    .input('description', data.description)
    .query(`INSERT INTO Categories (categoryName, description)
            OUTPUT INSERTED.* VALUES (@categoryName, @description)`);
  return result.recordset[0];
};

const updateCategory = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('categoryId', id)
    .input('categoryName', data.categoryName)
    .input('description', data.description)
    .query(`UPDATE Categories SET categoryName = @categoryName, description=@description
            OUTPUT INSERTED.*  WHERE categoryId = @categoryId`);
  return result.recordset[0];
};
const deleteCategory = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('categoryId', id)
    .query(
      'UPDATE Categories SET isDeleted = 1 WHERE categoryId = @categoryId'
    );
};
module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
