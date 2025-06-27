import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/users';

export const getAllUsers = () => axiosInstance.get(BASE_URL);

export const deleteUser = (id) => axiosInstance.delete(`${BASE_URL}/${id}`);

export const createUser = (data) => axiosInstance.post(BASE_URL, data);

export const updateUser = (id, data) =>
  axiosInstance.put(`${BASE_URL}/${id}`, data);
