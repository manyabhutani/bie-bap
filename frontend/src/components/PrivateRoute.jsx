import React from 'react';
import { Navigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const isTokenValid = (token) => {
    if (!token) return false;
    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch (error) {
        console.error('Token decode error:', error);
        return false;
    }
};

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('accessToken');
    if (!token || !isTokenValid(token)) {
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PrivateRoute;
