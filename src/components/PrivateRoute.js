import React from 'react';
import { useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken');
    const location = useLocation();

    if (!token) {
        const logoutUrl = `${process.env.REACT_APP_API_BASE_URL.replace('/msg', '')}/lib/`;
        window.location.href = logoutUrl; 
        return null; 
    }

    return children; 
};

export default PrivateRoute;
