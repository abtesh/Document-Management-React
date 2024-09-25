import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

// Component to protect routes
const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('authToken'); // Get the token from localStorage
    const location = useLocation();

    if (!token) {
        // Redirect them to the login page if not logged in
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children; // Render the children if authenticated
};

export default PrivateRoute;
