import axiosInstance from './axiosInstance';

export const fetchMyOrders = () => axiosInstance.get('/orders/my');
export const checkoutOrder = (payload) =>
  axiosInstance.post('/orderdetails/', payload);
export const cancelOrder = (orderId) =>
  axiosInstance.delete(`/orders/${orderId}`);

// export const getVnpayUrl = (amount, orderId) =>
//   axiosInstance.post('/payment/vnpay', { amount, orderId });
export const checkoutVnpay = (payload) =>
  axiosInstance.post('/payment/vnpay', payload);
