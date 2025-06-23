// src/services/productService.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/products'; // sửa nếu khác

export const getAllProducts = () => {
  return axios.get(BASE_URL);
};
