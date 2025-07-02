// axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Nếu lỗi 401 - Unauthorized => token có thể hết hạn
      localStorage.removeItem('token'); // Xoá token cũ
      window.location.href = '/login'; // Chuyển về login
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;
