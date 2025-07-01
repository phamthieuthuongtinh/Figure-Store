import axiosInstance from './axiosInstance';

export const getAllProducts = () => axiosInstance.get('/products');

export const getAllSales = () => axiosInstance.get('/sales');

export const getFlashSaleProducts = () =>
  axiosInstance.get('/products/flash-sale');
