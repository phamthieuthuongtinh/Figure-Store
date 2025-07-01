// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/sales';

export const getAllSales = () => axiosInstance.get(BASE_URL);

export const deleteSale = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createSale = (data) => axiosInstance.post(BASE_URL, data);

export const updateSale = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
