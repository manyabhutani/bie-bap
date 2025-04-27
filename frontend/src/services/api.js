import axios from 'axios';

//render
const API_URL = 'https://volunteer-backend-xwn1.onrender.com';

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
