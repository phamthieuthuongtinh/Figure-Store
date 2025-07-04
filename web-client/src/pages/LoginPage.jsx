import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { login } from '../services/UserService';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [form, setForm] = useState({ userEmail: '', userPassword: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      const { user, accessToken } = res.data.data;
      dispatch(setAuth({ user, accessToken }));
      toast.success('Đăng nhập thành công!');
      navigate('/', { replace: true }); // về trang chủ
    } catch (err) {
      toast.error(err.response?.data?.message || 'Lỗi đăng nhập');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-5 mt-10"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Đăng nhập
      </h2>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="userEmail"
          type="text"
          placeholder="Nhập email"
          value={form.userEmail}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Mật khẩu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mật khẩu
        </label>
        <input
          name="userPassword"
          type="password"
          placeholder="Nhập mật khẩu"
          value={form.userPassword}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
      >
        Đăng nhập
      </button>
      <p className="text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-blue-500 hover:underline">
          Đăng ký ngay
        </Link>
      </p>
    </form>
  );
}

export default LoginPage;
