const { poolPromise } = require('../config/db');

const getProductImages = async (productId) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('productId', productId)
    .query('SELECT * FROM ProductImages WHERE productId = @productId');
  return result.recordset;
};

const addProductImageByUrl = async ({ productId, imageUrl }) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('productId', productId)
    .input('imageUrl', imageUrl).query(`
      INSERT INTO ProductImages (productId, imageUrl)
      OUTPUT INSERTED.*
      VALUES (@productId, @imageUrl)
    `);
  return result.recordset[0];
};

const deleteProductImage = async (imageId) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('imageId', imageId)
    .query('DELETE FROM ProductImages WHERE imageId = @imageId');
};

module.exports = {
  getProductImages,
  addProductImageByUrl,
  deleteProductImage,
};
