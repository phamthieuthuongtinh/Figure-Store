// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/categories';

export const getAllCategories = () => axiosInstance.get(BASE_URL);

export const deleteCategory = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createCategory = (data) => axiosInstance.post(BASE_URL, data);

export const updateCategory = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
