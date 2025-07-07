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
const createOrderDetail = async ({ orderId, items }) => {
  const pool = await poolPromise;
  const transaction = new sql.Transaction(pool);
  try {
    await transaction.begin();

    const insertedItems = [];

    for (const item of items) {
      // 1. Kiểm tra tồn kho
      const stock = await transaction
        .request()
        .input('productId', item.productId)
        .query('SELECT quantity FROM Products WHERE productId = @productId');

      const current = stock.recordset[0]?.quantity ?? 0;
      if (current < item.quantity) {
        // Không đủ hàng → huỷ đơn
        await transaction
          .request()
          .input('orderId', orderId)
          .query('DELETE FROM Orders WHERE orderId = @orderId');
        throw new Error(`Sản phẩm ID ${item.productId} không đủ tồn kho`);
      }

      // 2. Trừ kho
      await transaction
        .request()
        .input('productId', item.productId)
        .input('qty', item.quantity).query(`
          UPDATE Products
          SET quantity = quantity - @qty
          WHERE productId = @productId
        `);

      // 3. Thêm chi tiết
      const detailRes = await transaction
        .request()
        .input('orderId', orderId)
        .input('productId', item.productId)
        .input('quantity', item.quantity)
        .input('priceAtTime', item.priceAtTime).query(`
          INSERT INTO OrderDetails (orderId, productId, quantity, priceAtTime)
          OUTPUT INSERTED.*
          VALUES (@orderId, @productId, @quantity, @priceAtTime)
        `);

      insertedItems.push(detailRes.recordset[0]);
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
