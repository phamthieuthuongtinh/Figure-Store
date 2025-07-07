const { poolPromise } = require('../config/db');
const sql = require('mssql');
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
    .input('paymentMethod', data.paymentMethod || 'COD')
    .input('paymentStatus', 'unpaid')
    .query(`INSERT INTO Orders (userId, totalPrice, couponId, discountAmount, paymentMethod, paymentStatus)
            OUTPUT INSERTED.* VALUES (@userId, @totalPrice,@couponId, @discountAmount, @paymentMethod, @paymentStatus)`);
  return result.recordset[0];
};

const updateOrder = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('orderId', id)
    .input('status', data.status)
    .input('paymentStatus', 'paid').query(`
      UPDATE Orders SET status = @status,
        paymentStatus = CASE WHEN  @status = 'delivered' THEN @paymentStatus
            ELSE paymentStatus END,
        paymentTime   = CASE WHEN @status = 'delivered' THEN GETDATE()
            ELSE paymentTime   END
        OUTPUT INSERTED.*  WHERE orderId = @orderId`);
  return result.recordset[0];
};
const deleteOrder = async (orderId) => {
  const pool = await poolPromise;
  const trx = new sql.Transaction(pool);
  try {
    await trx.begin();

    /* 1️⃣  Lấy trạng thái đơn */
    const orderRes = await trx
      .request()
      .input('orderId', orderId)
      .query(
        'SELECT status FROM Orders WHERE orderId = @orderId AND isDeleted = 0'
      );

    if (!orderRes.recordset.length) {
      throw new Error('Không tìm thấy đơn hàng');
    }

    if (orderRes.recordset[0].status !== 'pending') {
      throw new Error('Chỉ được huỷ đơn khi đang chờ xác nhận (pending)');
    }

    /* 2️⃣  Trả lại kho cho tất cả sản phẩm thuộc đơn */
    await trx.request().input('orderId', orderId).query(`
        UPDATE  p
        SET     p.quantity = p.quantity + od.quantity
        FROM    Products p
        JOIN    OrderDetails od ON od.productId = p.productId
        WHERE   od.orderId = @orderId
      `);

    /* 3️⃣  Cập nhật trạng thái đơn */
    await trx.request().input('orderId', orderId).query(`
        UPDATE Orders
        SET    status = 'cancelled',
               isDeleted = 1
        WHERE  orderId = @orderId
      `);

    await trx.commit();
    return { message: 'Huỷ đơn thành công' };
  } catch (err) {
    await trx.rollback();
    throw err;
  }
};

const getMyOrders = async (userId) => {
  const pool = await poolPromise;

  const ordersRes = await pool
    .request()
    .input('userId', userId)
    .query(`SELECT * FROM Orders WHERE userId = @userId AND isDeleted=0`);

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
