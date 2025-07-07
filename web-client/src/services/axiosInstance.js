// axiosInstance.js
import axios from 'axios';
import { toast } from 'react-toastify';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login'; // điều hướng về trang login
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
