// import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/banners';

export const getAllBanners = () => axiosInstance.get(BASE_URL);

export const deleteBanner = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createBanner = (data) => axiosInstance.post(BASE_URL, data);

export const updateBanner = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
