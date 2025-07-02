import axiosInstance from './axiosInstance';

export const getAllCategories = () => axiosInstance.get('/categories');
export const getCategoryById = () => axiosInstance.get('/categories/:id');
