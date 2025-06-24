import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/products';

export const getAllProducts = () => axiosInstance.get(BASE_URL);

export const deleteProduct = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createProduct = (data) => axiosInstance.post(BASE_URL, data);

export const updateProduct = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
