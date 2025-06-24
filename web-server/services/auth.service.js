const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise } = require('../config/db');

exports.login = async (email, password) => {
  const pool = await poolPromise;
  const result = await pool
    .request()
    .input('email', email)
    .query('SELECT * FROM Users WHERE userEmail = @email AND isDeleted = 0');

  const user = result.recordset[0];

  if (!user || user.userRole !== 'admin') {
    throw { status: 403, message: 'Tài khoản không có quyền truy cập' };
  }

  const isMatch = bcrypt.compareSync(password, user.userPassword);
  if (!isMatch) {
    throw { status: 401, message: 'Sai mật khẩu' };
  }

  const token = jwt.sign(
    { id: user.userId, role: user.userRole },
    process.env.JWT_SECRET || 'SECRET_KEY',
    { expiresIn: '1h' }
  );

  return {
    token,
    user: {
      id: user.userId,
      name: user.userName,
      email: user.userEmail,
      role: user.userRole,
    },
  };
};
