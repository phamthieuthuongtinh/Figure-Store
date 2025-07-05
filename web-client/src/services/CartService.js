import axiosInstance from './axiosInstance';

export const fetchMyCart = () => axiosInstance.get('/carts/my');
export const addCartItem = (body) => axiosInstance.post('/carts/items', body);
export const updateCartItem = (itemId, body) =>
  axiosInstance.patch(`/carts/items/${itemId}`, body);
export const deleteCartItem = (itemId) =>
  axiosInstance.delete(`/carts/items/${itemId}`);
export const syncCart = (items) => axiosInstance.post('/carts/sync', items);
