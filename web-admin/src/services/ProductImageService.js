import axiosInstance from './axiosInstance';
const BASE_URL = 'http://localhost:5000/api/product-images';

export const getProductImages = (productId) =>
  axiosInstance.get(`${BASE_URL}/${productId}`);

export const deleteProductImage = (imageId) =>
  axiosInstance.delete(`${BASE_URL}/${imageId}`);

export const addProductImageByUrl = (productId, imageUrl) =>
  axiosInstance.post(`${BASE_URL}/${productId}`, { imageUrl });
