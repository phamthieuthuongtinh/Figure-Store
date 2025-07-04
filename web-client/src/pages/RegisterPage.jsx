import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAuth } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { register } from '../services/UserService';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  const [form, setForm] = useState({
    userName: '',
    userEmail: '',
    userPassword: '',
    confirmPassword: '',
    userAddress: '',
    userPhone: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.count('submit');
    // ✅ Kiểm tra mật khẩu khớp
    if (form.userPassword !== form.confirmPassword) {
      toast.error('Mật khẩu và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      // Tách bỏ confirmPassword trước khi gửi
      const { confirmPassword, ...payload } = form;
      const res = await register(payload);

      const { user, accessToken } = res.data.data;
      dispatch(setAuth({ user, accessToken }));
      toast.success('Đăng ký thành công!');
      navigate('/', { replace: true });
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Email đã tồn tại hoặc có lỗi hệ thống'
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-5 mt-10"
    >
      <h2 className="text-2xl font-semibold text-center text-gray-800">
        Đăng ký tài khoản
      </h2>

      {/* Họ tên */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Họ tên
        </label>
        <input
          name="userName"
          placeholder="Nhập họ tên"
          value={form.userName}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          name="userEmail"
          type="email"
          placeholder="Nhập email"
          value={form.userEmail}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Xác nhận mật khẩu */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Xác nhận mật khẩu
        </label>
        <input
          name="confirmPassword"
          type="password"
          placeholder="Nhập lại mật khẩu"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Địa chỉ */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ
        </label>
        <input
          name="userAddress"
          placeholder="Nhập địa chỉ"
          value={form.userAddress}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Số điện thoại */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Số điện thoại
        </label>
        <input
          name="userPhone"
          placeholder="Nhập số điện thoại"
          value={form.userPhone}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Nút submit */}
      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-semibold transition duration-200"
      >
        Đăng ký
      </button>
    </form>
  );
}

export default RegisterPage;
