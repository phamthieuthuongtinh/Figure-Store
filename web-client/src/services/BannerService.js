// services/bannerAPI.js
import axiosInstance from './axiosInstance';

export const getAllBanners = () => axiosInstance.get('/banners');
