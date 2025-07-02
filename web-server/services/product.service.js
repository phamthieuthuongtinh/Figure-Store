const { poolPromise } = require('../config/db');

const getAllProducts = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query(
      'SELECT * FROM Products WHERE isDeleted = 0 ORDER BY productId DESC'
    );
  return result.recordset;
};
const getProductById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('productId', id)
    .query(
      'SELECT * FROM Products where productId = @productId and isDeleted = 0'
    );
  return result.recordset[0];
};
const getProductByCategoryId = async (id) => {
  const pool = await poolPromise;
  const result = await pool.request().input('categoryId', parseInt(id)).query(`
      SELECT 
        p.productId,
        p.productName,
        p.productPrice,
        p.imageUrl,
        s.discountPercent,
        s.endDate,
        CASE
        WHEN s.discountPercent IS NOT NULL
        AND s.endDate > GETDATE()
          THEN CAST(p.productPrice * (1 - s.discountPercent / 100.0) AS INT)
          ELSE NULL
        END AS discountedPrice,
        CASE 
          WHEN s.discountPercent IS NOT NULL AND s.endDate > GETDATE() THEN 1
          
          ELSE 0
        END AS isOnSale
      FROM Products AS p
      LEFT JOIN Sales AS s
        ON p.productId = s.productId
        AND s.endDate > GETDATE()
      WHERE p.categoryId = @categoryId
        AND p.isDeleted = 0
      ORDER BY p.productId DESC;
    `);
  return result.recordset;
};

const createProduct = async (data) => {
  const pool = await poolPromise;
  // console.log(typeof data.productPrice, data.productPrice);
  const result = await pool
    .request()
    .input('productName', data.productName)
    .input('description', data.description)
    .input('productPrice', data.productPrice)
    .input('categoryId', data.categoryId)
    .input('brandId', data.brandId)
    .input('imageUrl', data.imageUrl)
    .input('quantity', data.quantity)
    .query(`INSERT INTO Products (productName, description, productPrice, categoryId, brandId, imageUrl,quantity)
            OUTPUT INSERTED.* VALUES (@productName, @description , @productPrice, @categoryId, @brandId, @imageUrl,@quantity)`);
  return result.recordset[0];
};

const updateProduct = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('productId', id)
    .input('productName', data.productName)
    .input('description', data.description)
    .input('productPrice', data.productPrice)
    .input('categoryId', data.categoryId)
    .input('brandId', data.brandId)
    .input('imageUrl', data.imageUrl)
    .input('quantity', data.quantity)
    .query(`UPDATE Products SET productName = @productName, description=@description, productPrice= @productPrice, 
            categoryId= @categoryId, brandId= @brandId, imageUrl= @imageUrl, quantity = @quantity
            OUTPUT INSERTED.*  WHERE productId = @productId`);
  return result.recordset[0];
};
const deleteProduct = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('productId', id)
    .query('UPDATE Products SET isDeleted = 1 WHERE productId = @productId');
};
const getFlashSaleProducts = async (req, res) => {
  const pool = await poolPromise;
  const result = await pool.request().query(`
      SELECT
        s.saleId,
        s.productId,
        p.productName,
        p.imageUrl,
        p.productPrice,
        s.discountPercent,
        (p.productPrice - p.productPrice * s.discountPercent / 100.0) AS discountedPrice,
        s.startDate,
        s.endDate
      FROM  Sales    s
      JOIN  Products p ON p.productId = s.productId
      WHERE s.status = 1
        AND GETDATE() BETWEEN s.startDate AND s.endDate
      ORDER BY s.startDate DESC;
    `);
  return result.recordset;
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
