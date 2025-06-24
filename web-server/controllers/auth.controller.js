const AuthService = require('../services/auth.service');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.login(email, password);
    res.json(result);
  } catch (err) {
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Lỗi server' });
  }
};
module.exports = {
  login,
};
