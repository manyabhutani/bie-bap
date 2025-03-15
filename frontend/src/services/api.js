import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

const API = axios.create({
    baseURL: API_URL,
});

API.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default API;
