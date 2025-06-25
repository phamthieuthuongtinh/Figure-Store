const { poolPromise } = require('../config/db');
const sql = require('mssql');
const getAllOrderDetails = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM OrderDetails WHERE isDeleted = 0');
  return result.recordset;
};
const getOrderDetailById = async (id) => {
  const pool = await poolPromise;
  const result = (await pool)
    .request()
    .input('orderId', id)
    .query(
      'SELECT * FROM OrderDetails WHERE orderId=@orderId AND isDeleted = 0'
    );
  return (await result).recordset;
};
const createOrderDetail = async (data) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);

  try {
    await transaction.begin();

    const insertedItems = [];

    for (const item of data.items) {
      const request = new sql.Request(transaction);
      const result = await request
        .input('orderId', data.orderId)
        .input('productId', item.productId)
        .input('quantity', item.quantity)
        .input('priceAtTime', item.priceAtTime).query(`
          INSERT INTO OrderDetails (orderId, productId, quantity, priceAtTime)
          OUTPUT INSERTED.*
          VALUES (@orderId, @productId, @quantity, @priceAtTime)
        `);
      insertedItems.push(result.recordset[0]);
    }

    await transaction.commit();
    return insertedItems;
  } catch (err) {
    await transaction.rollback();
    throw err;
  }
};

module.exports = {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
};
