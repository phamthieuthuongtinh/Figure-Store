import axiosInstance from './axiosInstance';

export const register = (data) => axiosInstance.post('/users/register', data);
export const login = (data) => axiosInstance.post('/users/login', data);
