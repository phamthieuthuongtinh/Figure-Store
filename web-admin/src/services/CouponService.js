// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/coupons';

export const getAllCoupons = () => axiosInstance.get(BASE_URL);

export const deleteCoupon = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createCoupon = (data) => axiosInstance.post(BASE_URL, data);

export const updateCoupon = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
