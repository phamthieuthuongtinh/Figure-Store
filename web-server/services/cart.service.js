const { poolPromise } = require('../config/db');

// Trợ giúp: lấy cartId theo userId
const getCartIdByUser = async (userId) => {
  const pool = await poolPromise;
  const res = await pool
    .request()
    .input('userId', userId)
    .query('SELECT cartId FROM Carts WHERE userId=@userId');
  return res.recordset[0]?.cartId;
};

/* 1. Lấy danh sách item */
const getCartItems = async (userId) => {
  const cartId = await getCartIdByUser(userId);
  if (!cartId) return [];
  const pool = await poolPromise;
  const res = await pool.request().input('cartId', cartId).query(`
    SELECT ci.cartItemId,          -- sửa lại
           ci.productId,
           p.productName,
           p.imageUrl,
           ci.quantity,
           ci.priceAtTime
    FROM   CartItems ci
    JOIN   Products p ON ci.productId = p.productId
    WHERE  ci.cartId = @cartId
  `);
  return res.recordset;
};

/* 2. Thêm item */
const addItem = async (userId, { productId, quantity }) => {
  const cartId = await getCartIdByUser(userId);
  const pool = await poolPromise;

  // Kiểm tra xem đã tồn tại sản phẩm này trong giỏ chưa
  const dup = await pool
    .request()
    .input('cartId', cartId)
    .input('productId', productId)
    .query(
      'SELECT cartItemId, quantity FROM CartItems WHERE cartId=@cartId AND productId=@productId'
    );

  if (dup.recordset.length) {
    // Nếu có rồi → cập nhật quantity
    const cartItemId = dup.recordset[0].cartItemId;
    quantity += dup.recordset[0].quantity;
    await pool
      .request()
      .input('cartItemId', cartItemId)
      .input('quantity', quantity)
      .query(
        'UPDATE CartItems SET quantity=@quantity WHERE cartItemId=@cartItemId'
      );

    return {
      cartItemId,
      productId,
      quantity,
    };
  }

  // Lấy giá hiện tại của sản phẩm

  const priceRes = await pool
    .request()
    .input('productId', productId)
    .query('SELECT productPrice FROM Products WHERE productId=@productId');
  const originalPrice = priceRes.recordset[0].productPrice;

  const saleRes = await pool.request().input('productId', productId).query(`
      SELECT TOP 1 discountPercent
      FROM Sales
      WHERE productId=@productId
        AND startDate <= GETDATE()
        AND endDate   >= GETDATE()
    `);
  const discountPercent = saleRes.recordset[0]?.discountPercent || 0;

  const finalPrice = originalPrice * (1 - discountPercent / 100);

  const insertRes = await pool
    .request()
    .input('cartId', cartId)
    .input('productId', productId)
    .input('quantity', quantity)
    .input('priceAtTime', finalPrice).query(`
      INSERT INTO CartItems(cartId, productId, quantity, priceAtTime)
      OUTPUT INSERTED.cartItemId
      VALUES (@cartId, @productId, @quantity, @priceAtTime)
    `);
  const cartItemId = insertRes.recordset[0].cartItemId;
  return {
    cartItemId,
    productId,
    quantity,
    priceAtTime: finalPrice,
  };
};

/* 3. Cập nhật số lượng */
const updateItemQty = async (userId, id, quantity) => {
  const cartId = await getCartIdByUser(userId);
  const pool = await poolPromise;
  const res = await pool
    .request()
    .input('id', id)
    .input('cartId', cartId)
    .query('SELECT 1 FROM CartItems WHERE cartItemId=@id AND cartId=@cartId');
  if (!res.recordset.length)
    throw { status: 404, message: 'Item không tồn tại' };

  if (quantity <= 0) {
    await pool
      .request()
      .input('id', id)
      .query('DELETE FROM CartItems WHERE cartItemId=@id');
  } else {
    await pool
      .request()
      .input('id', id)
      .input('quantity', quantity)
      .query('UPDATE CartItems SET quantity=@quantity WHERE cartItemId=@id');
  }
};

/* 4. Xóa item */
const deleteItem = async (userId, id) => {
  const cartId = await getCartIdByUser(userId);
  const pool = await poolPromise;
  await pool
    .request()
    .input('id', id)
    .input('cartId', cartId)
    .query('DELETE FROM CartItems WHERE cartItemId=@id AND cartId=@cartId');
};

module.exports = { getCartItems, addItem, updateItemQty, deleteItem };
