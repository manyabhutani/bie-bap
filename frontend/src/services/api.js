import axios from 'axios';

//docker
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

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
