const { poolPromise } = require('../config/db');

const getAllProducts = async () => {
    const pool = await poolPromise;
    const result = await pool.request().query('SELECT * FROM Products WHERE isDeleted = 0');
    return result.recordset;
};
const getProductById = async (id) => {
    const pool = await poolPromise;
    const result = await pool.request().input('productId', id).query('SELECT * FROM Products where productId = @productId and isDeleted = 0');
    return result.recordset[0];
};
const createProduct = async (data) => {
    const pool = await poolPromise;
    // console.log(typeof data.productPrice, data.productPrice);
    const result = await pool.request()
        .input('productName', data.productName)
        .input('description', data.description)
        .input('productPrice', data.productPrice)
        .input('categoryId', data.categoryId)
        .input('brandId', data.brandId)
        .input('imageUrl', data.imageUrl)
        .query(`INSERT INTO Products (productName, description, productPrice, categoryId, brandId, imageUrl)
            OUTPUT INSERTED.* VALUES (@productName, @description , @productPrice, @categoryId, @brandId, @imageUrl)`);
    return result.recordset[0];
}

const updateProduct = async (id, data) => {
    const pool = await poolPromise;
    const result = await pool.request()
        .input('productId', id)
        .input('productName', data.productName)
        .input('description', data.description)
        .input('productPrice', data.productPrice)
        .input('categoryId', data.categoryId)
        .input('brandId', data.brandId)
        .input('imageUrl', data.imageUrl)
        .query(`UPDATE Products SET productName = @productName, description=@description, productPrice= @productPrice, 
            categoryId= @categoryId, brandId= @brandId, imageUrl= @imageUrl
            OUTPUT INSERTED.*  WHERE productId = @productId`);
    return result.recordset[0];
}
const deleteProduct = async (id) => {
    const pool = await poolPromise;
    await pool.request()
        .input('productId', id)
        .query('UPDATE Products SET isDeleted = 1 WHERE productId = @productId');
};
module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
