import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/brands';

export const getAllBrands = () => axios.get(BASE_URL);

export const deleteBrand = (id) => axios.delete(`${BASE_URL}/${id}`);

export const createBrand = (data) => axios.post(BASE_URL, data);

export const updateBrand = (id, data) => axios.put(`${BASE_URL}/${id}`, data);
