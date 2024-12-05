import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';
import myImage from "../Images/anbesa-removebg-preview.png";


const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const LoginComponent = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [regions, setRegions] = useState([]);

    useEffect(() => {
        // Fetch regions when the component loads
        axios
            .get(`${BASE_URL}/phoneBook/regions`)
            .then((response) => setRegions(response.data))
            .catch((err) => console.error('Error fetching regions:', err));
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, { email, password });
            localStorage.setItem('authToken', response.data.data);
            navigate('/welcome-page');
        } catch (err) {
            console.error('Login error:', err);
            setError('Invalid email or password. Please try again.');
        }
    };

    const handleRegionClick = (regionId) => {
        navigate(`/region-district-branch/${regionId}`);
    };

    return (
        <div className="login-container">
            {/* Phone Book Button */}
            {/* <div className="phone-book-header">
            <img
                                    src={myImage}
                                    alt="Logo"
                                    style={{ height: 50, width: 80 }}
                                />
                <button
                    className="btn btn-primary phone-book-button"
                    onClick={() => navigate('/phone-book')}
                >
                    Phone Book
                </button>
            </div> */}

            {/* Regions */}
            <div className="title-side-left"> <h5> <b>Phone Directory</b></h5>  </div>
            <div className="title-side-right"> <h5> <b>Phone Directory</b></h5>  </div>

                        <div className="region-container">
                {regions.slice(0, 1).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-top-left"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        
                        {region.regionName}
                    </div>
                ))}
                
                {regions.slice(1, 2).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-top-right"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        {region.regionName}
                    </div>
                ))}
                {regions.slice(2, 3).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-middle-left"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        {region.regionName}
                    </div>
                ))}
                {regions.slice(3, 4).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-middle-right"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        {region.regionName}
                    </div>
                ))}
                {regions.slice(4, 5).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-bottom-left"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        {region.regionName}
                    </div>
                ))}
                {regions.slice(5, 6).map((region) => (
                    <div
                        key={region.id}
                        className="region-link region-bottom-right"
                        onClick={() => handleRegionClick(region.id)}
                    >
                        {region.regionName}
                    </div>
                ))}
                    {/* Add Head Quarters Button */}
                <div
                    className="region-link region-middle-right"
                    onClick={() => navigate("/hq-organs")}
                >
                    Head Quarters
                </div>
            </div>

            {/* Login Card */}
            <div className="card shadow-lg">
                <h2 className="text-center mb-4">Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="form-group mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginComponent;
