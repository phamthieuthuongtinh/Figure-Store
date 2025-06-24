import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/auth/login';

export const login = (data) => axios.post(BASE_URL, data);
