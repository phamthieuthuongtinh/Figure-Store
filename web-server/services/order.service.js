const { poolPromise } = require('../config/db');

const getAllOrders = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Orders WHERE isDeleted = 0');
  return result.recordset;
};
const getOrderById = async (id) => {
  const pool = await poolPromise;
  const result = (await pool)
    .request()
    .input('orderId', id)
    .query('SELECT * FROM Orders WHERE orderId=@orderId AND isDeleted = 0');
  return (await result).recordset[0];
};
const createOrder = async (data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('userId', data.userId)
    .input('totalPrice', data.totalPrice)
    .input('couponId', data.couponId || null)
    .input('discountAmount', data.discountAmount || 0)
    .query(`INSERT INTO Orders (userId, totalPrice, couponId, discountAmount)
            OUTPUT INSERTED.* VALUES (@userId, @totalPrice,@couponId, @discountAmount)`);
  return result.recordset[0];
};

const updateOrder = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('orderId', id)
    .input('status', data.status).query(`UPDATE Orders SET status = @status
            OUTPUT INSERTED.*  WHERE orderId = @orderId`);
  return result.recordset[0];
};
const deleteOrder = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('orderId', id)
    .query('UPDATE Orders SET isDeleted = 1 WHERE orderId = @orderId');
};

const getMyOrders = async (userId) => {
  const pool = await poolPromise;

  const ordersRes = await pool
    .request()
    .input('userId', userId)
    .query(`SELECT * FROM Orders WHERE userId = @userId`);

  const orders = [];

  for (const order of ordersRes.recordset) {
    const itemsRes = await pool.request().input('orderId', order.orderId)
      .query(`SELECT od.*, p.productName 
              FROM OrderDetails od 
              JOIN Products p ON p.productId = od.productId 
              WHERE od.orderId = @orderId`);

    orders.push({
      ...order,
      items: itemsRes.recordset,
    });
  }

  return orders;
};
module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
};
