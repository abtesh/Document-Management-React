import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import myImage from '../Images/anbesa-removebg-preview.png'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Layout.css'; // Import your CSS file for media queries

function Layout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    // Function to extract user's name from token
    const getUser = () => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const decodedToken = JSON.parse(window.atob(base64));
            return decodedToken.name;
        }
        return null;
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/');
        window.history.replaceState(null, null, '/');
        window.location.reload(true);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="container-fluid">
            <header className="sticky-top row bg-light">
                <div className="col-md-12">
                    <nav className="navbar navbar-expand-lg navbar-light">
                        <div className="container-fluid">
                            {/* Logo */}
                            <a className="navbar-brand" href="/welcome-page">
                                <img src={myImage} alt="Logo" style={{ height: 50, width: 80 }} />
                            </a>
                            <div style={{ width: "440px" }}></div>

                            {/* Welcome message */}
                            <span className="navbar-text ms-2 text-primary fw-bold">
                                Welcome, {getUser()}
                            </span>
                            <div style={{ width: "400px" }}></div>

                            {/* Logout button */}
                            <div className="ms-auto">
                                <button
                                    className="nav-link btn"
                                    style={{
                                        backgroundColor: '#007bff',
                                        color: '#ffffff',
                                        width: 80,
                                        height: 40,
                                        border: 'none',
                                        borderRadius: '4px'
                                    }}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </button>
                            </div>

                            {/* Hamburger menu for mobile */}
                            <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>
                    </nav>
                </div>
            </header>

            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar */}
                    <nav className={`col-md-3 col-lg-2 d-md-block bg-dark text-white sidebar ${isSidebarOpen ? 'open' : ''}`} style={{ 
                        position: 'fixed', 
                        top: '60px', 
                        left: 0, 
                        bottom: 0, 
                        width: '250px', 
                        height: 'calc(100vh - 60px)', 
                        overflowY: 'auto',
                        paddingTop: '1rem'
                    }}>
                        <div className="position-sticky">
                            <h3 className="sidebar-heading fw-bold text-light mb-4">Menu</h3>
                            <ul className="nav flex-column">
                                <li className="nav-item mb-2">
                                    <Link className="nav-link px-3 py-2 rounded text-white" to="/groups">
                                        <i className="fas fa-users me-2"></i> Manage Groups
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link px-3 py-2 rounded text-white" to="/create-group">
                                        <i className="fas fa-plus me-2"></i> Create Group
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link px-3 py-2 rounded text-white" to="/message">
                                        <i className="fas fa-envelope me-2"></i> Individual Message
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link px-3 py-2 rounded text-white" to="/inbox">
                                        <i className="fas fa-inbox me-2"></i> Inbox
                                    </Link>
                                </li>
                                <li className="nav-item mb-2">
                                    <Link className="nav-link px-3 py-2 rounded text-white" to="/sent">
                                        <i className="fas fa-paper-plane me-2"></i> Sent
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </nav>

                    {/* Main content */}
                    <main className="col-md-9 ms-sm-auto col-lg-10 px-4" style={{ marginLeft: '250px' }}>
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default Layout;
