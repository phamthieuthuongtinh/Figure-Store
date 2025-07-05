import axiosInstance from './axiosInstance';

export const fetchMyOrders = () => axiosInstance.get('/orders/my');
