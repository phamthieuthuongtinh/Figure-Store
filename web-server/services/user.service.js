const { poolPromise } = require('../config/db');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;
const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .query('SELECT * FROM Users WHERE isDeleted = 0');
  const users = result.recordset.map(({ userPassword, ...rest }) => rest);
  return users;
};
const getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('userId', id)
    .query('SELECT * FROM Users WHERE userId=@userId AND isDeleted = 0');

  const user = result.recordset?.[0]; // dùng optional chaining

  if (!user) return null; // hoặc throw lỗi nếu muốn

  const { userPassword, ...safeUser } = user;
  return safeUser;
};

// const getUserByEmail = async (email) => {
//   const pool = await poolPromise;
//   const result = (await pool)
//     .request()
//     .input('userEmail', email)
//     .query('SELECT * FROM Users WHERE userEmail=@userEmail AND isDeleted = 0');
//   return (await result).recordset[0];
// };
// const getUserByPhone = async (phone) => {
//   const pool = await poolPromise;
//   const result = (await pool)
//     .request()
//     .input('userPhone', phone)
//     .query('SELECT * FROM Users WHERE userPhone=@userPhone AND isDeleted = 1');
//   return (await result).recordset[0];
// };
const createUser = async (data) => {
  const pool = await poolPromise;
  const hashedPassword = await bcrypt.hash(data.userPassword, SALT_ROUNDS);
  const result = await pool
    .request()
    .input('userEmail', data.userEmail)
    .input('userPassword', hashedPassword)
    .input('userName', data.userName)
    .input('userAddress', data.userAddress)
    .input('userPhone', data.userPhone)
    .input('userRole', 'customer')
    .query(`INSERT INTO Users (userEmail, userPassword, userName, userAddress,userPhone)
            OUTPUT INSERTED.* VALUES (@userEmail, @userPassword,@userName, @userAddress,@userPhone)`);
  const user = result.recordset?.[0];
  if (!user) return null;
  const { userPassword, ...safeUser } = user;
  return safeUser;
};

const updateUser = async (id, data) => {
  const pool = await poolPromise;
  const hashedPassword = await bcrypt.hash(data.userPassword, SALT_ROUNDS);
  const result = await pool
    .request()
    .input('userId', id)
    .input('userEmail', data.userEmail)
    .input('userPassword', hashedPassword)
    .input('userName', data.userName)
    .input('userAddress', data.userAddress)
    .input('userPhone', data.userPhone).query(`
      UPDATE Users SET 
        userEmail = @userEmail,
        userPassword = @userPassword,
        userName = @userName,
        userAddress = @userAddress,
        userPhone = @userPhone
      OUTPUT INSERTED.*
      WHERE userId = @userId
    `);
  const user = result.recordset?.[0];
  if (!user) return null;
  const { userPassword, ...safeUser } = user;
  return safeUser;
};
const deleteUser = async (id) => {
  const pool = await poolPromise;
  await pool
    .request()
    .input('userId', id)
    .query('UPDATE Users SET isDeleted = 1 WHERE userId = @userId');
};
const loginUser = async (data) => {
  const pool = await poolPromise;

  // ---- Đăng nhập bằng EMAIL ----
  if (data.userEmail) {
    const user = await pool
      .request()
      .input('userEmail', data.userEmail)
      .query(
        `SELECT * FROM Users WHERE userEmail = @userEmail AND isDeleted = 0`
      );

    if (!user.recordset.length)
      throw { status: 404, message: 'Email không tồn tại' };

    const found = user.recordset[0];
    const isMatch = await bcrypt.compare(data.userPassword, found.userPassword);
    if (!isMatch) throw { status: 401, message: 'Sai mật khẩu' };

    const { userPassword, ...safeUser } = found;
    return { code: 1, message: 'Đăng nhập thành công!', data: safeUser };
  }
  const user = await pool
    .request()
    .input('userPhone', data.userPhone)
    .query(
      `SELECT * FROM Users WHERE userPhone = @userPhone AND isDeleted = 0`
    );

  if (!user.recordset.length)
    throw { status: 404, message: 'Số điện thoại chưa đăng ký' };

  const found = user.recordset[0];
  const isMatch = await bcrypt.compare(data.userPassword, found.userPassword);
  if (!isMatch) throw { status: 401, message: 'Sai mật khẩu' };

  const { userPassword, ...safeUser } = found;
  return { code: 1, message: 'Đăng nhập thành công!', data: safeUser };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
};
