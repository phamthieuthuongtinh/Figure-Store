const { poolPromise } = require('../config/db');

const getAllCoupons = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Coupons WHERE isActive = 1');
  return result.recordset;
};
const getCouponById = async (id) => {
  const pool = await poolPromise;
  const result = (await pool)
    .request()
    .input('couponId', id)
    .query('SELECT * FROM Coupons WHERE couponId=@couponId AND isActive = 1');
  return (await result).recordset[0];
};
const createCoupon = async (data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('couponCode', data.couponCode)
    .input('description', data.description)
    .input('type', data.type)
    .input('value', data.value)
    .input('minOrderValue', data.minOrderValue)
    .input('maxUse', data.maxUse)
    .input('startDate', data.startDate)
    .input('endDate', data.endDate)
    .query(`INSERT INTO Coupons (couponCode, description, type, value,minOrderValue,maxUse,startDate,endDate)
            OUTPUT INSERTED.* VALUES (@couponCode, @description,@type, @value,@minOrderValue,@maxUse,@startDate,@endDate)`);
  return result.recordset[0];
};

const updateCoupon = async (id, data) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('couponId', id)
    .input('description', data.description)
    .input('type', data.type)
    .input('value', data.value)
    .input('minOrderValue', data.minOrderValue)
    .input('maxUse', data.maxUse)
    .input('startDate', data.startDate)
    .input('endDate', data.endDate).query(`
      UPDATE Coupons SET 
        description = @description,
        type = @type,
        value = @value,
        minOrderValue = @minOrderValue,
        maxUse = @maxUse,
        startDate = @startDate,
        endDate = @endDate
      OUTPUT INSERTED.*
      WHERE couponId = @couponId
    `);
  return result.recordset[0];
};
const deleteCoupon = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('couponId', id)
    .query('UPDATE Coupons SET isActive = 0 WHERE couponId = @couponId');
};
module.exports = {
  getAllCoupons,
  getCouponById,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
