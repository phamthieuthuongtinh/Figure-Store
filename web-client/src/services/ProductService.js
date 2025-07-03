import axiosInstance from './axiosInstance';

export const getAllProducts = () => axiosInstance.get('/products');

export const getProductByCategoryId = (categoryId) =>
  axiosInstance.get(`/products/category/${categoryId}`);

export const getProductById = (productId) =>
  axiosInstance.get(`/products/${productId}`);
export const getAllSales = () => axiosInstance.get('/sales');

export const getFlashSaleProducts = () =>
  axiosInstance.get('/products/flash-sale');
