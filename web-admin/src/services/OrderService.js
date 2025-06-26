// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/orders';

export const getAllOrders = () => axiosInstance.get(BASE_URL);
export const getOrderById = (id) => axiosInstance.get(`${BASE_URL}/${id}`);
export const deleteOrder = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const updateOrder = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
