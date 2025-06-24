import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/brands';

export const getAllBrands = () => axiosInstance.get(BASE_URL);

export const deleteBrand = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createBrand = (data) => axiosInstance.post(BASE_URL, data);

export const updateBrand = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
