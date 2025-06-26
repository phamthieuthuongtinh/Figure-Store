// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/orderdetails';

export const getOrderDetails = () => axiosInstance.get(BASE_URL);

export const getDetailByOrderId = (id) =>
  axiosInstance.get(`${BASE_URL}/${id}`);
