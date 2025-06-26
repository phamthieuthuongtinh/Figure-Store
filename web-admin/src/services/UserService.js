import axios from 'axios';
import axiosInstance from './axiosInstance';

const BASE_URL = 'http://localhost:5000/api/users';

export const getUserbyId = () => axiosInstance.get(BASE_URL);
