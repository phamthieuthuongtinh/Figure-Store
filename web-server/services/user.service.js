const { poolPromise } = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SALT_ROUNDS = 10;
const getAllUsers = async () => {
  const pool = await poolPromise;
  const result = await pool.request().query(`SELECT * FROM Users`);
  const users = result.recordset.map(({ userPassword, ...rest }) => rest);
  return users;
};
const getUserById = async (id) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('userId', id)
    .query('SELECT * FROM Users WHERE userId=@userId');

  const user = result.recordset?.[0];
  if (!user) return null;

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
  const role = data.userRole || 'customer';
  const result = await pool
    .request()
    .input('userEmail', data.userEmail)
    .input('userPassword', hashedPassword)
    .input('userName', data.userName)
    .input('userAddress', data.userAddress)
    .input('userPhone', data.userPhone)
    .input('userRole', role)
    .query(`INSERT INTO Users (userEmail, userPassword, userName, userAddress,userPhone,userRole)
            OUTPUT INSERTED.* VALUES (@userEmail, @userPassword,@userName, @userAddress,@userPhone,@userRole)`);
  const user = result.recordset?.[0];
  await pool
    .request()
    .input('userId', user.userId)
    .query('INSERT INTO Carts (userId) VALUES (@userId)');
  if (!user) return null;
  const { userPassword, ...safeUser } = user;
  return safeUser;
};

const updateUser = async (id, data) => {
  const pool = await poolPromise;

  let hashedPassword = null;
  if (data.userPassword) {
    hashedPassword = await bcrypt.hash(data.userPassword, SALT_ROUNDS);
  }
  const request = pool
    .request()
    .input('userId', id)
    .input('userEmail', data.userEmail)
    .input('userName', data.userName)
    .input('userAddress', data.userAddress)
    .input('userPhone', data.userPhone)
    .input('userRole', data.userRole || 'customer');

  if (hashedPassword) {
    request.input('userPassword', hashedPassword);
  }

  const sql = `
    UPDATE Users SET
      userEmail = @userEmail,
      userName = @userName,
      userAddress = @userAddress,
      userPhone = @userPhone,
      userRole = @userRole
      ${hashedPassword ? ', userPassword = @userPassword' : ''}
    OUTPUT INSERTED.*
    WHERE userId = @userId
  `;

  const result = await request.query(sql);
  const user = result.recordset?.[0];
  if (!user) return null;
  const { userPassword, ...safeUser } = user;
  return safeUser;
};

const deleteUser = async (id) => {
  const pool = await poolPromise;
  const user = await getUserById(id);

  if (!user) {
    throw new Error('Không tìm thấy người dùng để cập nhật trạng thái');
  }

  const isDeleted = user.isDeleted ? 0 : 1;
  await pool
    .request()
    .input('userId', id)
    .input('isDeleted', isDeleted)
    .query('UPDATE Users SET isDeleted = @isDeleted WHERE userId = @userId');
};

const registerUser = async (data) => {
  const pool = await poolPromise;

  // Kiểm tra trùng email
  const dup = await pool
    .request()
    .input('userEmail', data.userEmail)
    .query('SELECT 1 FROM Users WHERE userEmail=@userEmail AND isDeleted = 0');

  if (dup.recordset.length) throw { status: 409, message: 'Email đã tồn tại' };

  const hashedPassword = await bcrypt.hash(data.userPassword, SALT_ROUNDS);

  const result = await pool
    .request()
    .input('userEmail', data.userEmail)
    .input('userPassword', hashedPassword)
    .input('userName', data.userName)
    .input('userAddress', data.userAddress || '')
    .input('userPhone', data.userPhone || '')
    .input('userRole', 'customer').query(`
      INSERT INTO Users (userEmail, userPassword, userName, userAddress, userPhone, userRole, isDeleted)
      OUTPUT INSERTED.*
      VALUES (@userEmail, @userPassword, @userName, @userAddress, @userPhone, @userRole, 0)
    `);

  const user = result.recordset[0];
  await pool
    .request()
    .input('userId', user.userId)
    .query('INSERT INTO Carts (userId) VALUES (@userId)');
  const { userPassword, ...safeUser } = user;
  const accessToken = jwt.sign(
    { userId: safeUser.userId, role: safeUser.userRole },
    process.env.JWT_SECRET || 'SECRET_KEY',
    { expiresIn: '1h' }
  );

  return {
    message: 'Đăng ký thành công!',
    data: { user: safeUser, accessToken },
  };
};

const loginUser = async (data) => {
  const pool = await poolPromise;

  // Hàm token
  const signToken = (safeUser) =>
    jwt.sign(
      { userId: safeUser.userId, role: safeUser.userRole },
      process.env.JWT_SECRET || 'SECRET_KEY',
      { expiresIn: '1h' }
    );

  // ---- Đăng nhập bằng EMAIL ----
  if (data.userEmail) {
    const user = await pool
      .request()
      .input('userEmail', data.userEmail)
      .query('SELECT * FROM Users WHERE userEmail=@userEmail AND isDeleted=0');

    if (!user.recordset.length)
      throw { status: 404, message: 'Email không tồn tại' };

    const found = user.recordset[0];
    if (!(await bcrypt.compare(data.userPassword, found.userPassword)))
      throw { status: 401, message: 'Sai mật khẩu' };

    const { userPassword, ...safeUser } = found;
    const accessToken = signToken(safeUser);

    return {
      code: 1,
      message: 'Đăng nhập thành công!',
      data: { user: safeUser, accessToken },
    };
  }

  // ---- Đăng nhập bằng PHONE ----
  const user = await pool
    .request()
    .input('userPhone', data.userPhone)
    .query('SELECT * FROM Users WHERE userPhone=@userPhone AND isDeleted=0');

  if (!user.recordset.length)
    throw { status: 404, message: 'Số điện thoại chưa đăng ký' };

  const found = user.recordset[0];
  if (!(await bcrypt.compare(data.userPassword, found.userPassword)))
    throw { status: 401, message: 'Sai mật khẩu' };

  const { userPassword, ...safeUser } = found;
  const accessToken = signToken(safeUser);

  return {
    code: 1,
    message: 'Đăng nhập thành công!',
    data: { user: safeUser, accessToken },
  };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  registerUser,
};
