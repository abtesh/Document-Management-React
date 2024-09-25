import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEnvelope, FaUsers } from 'react-icons/fa';
import { Link } from "react-router-dom";
import Layout from "./Layout";
import myImage from '../Images/anbesa-removebg-preview.png';  // Import the logo

function WelcomePage() {
    return(
        <Layout>
            <div className="container mt-5 text-center">
            <img src={myImage} alt="Logo" style={{ height:100, width: 160}} className="mb-4" />
            <h1 className="mb-4"> Welcome </h1>
            <div className="d-flex justify-content-around">
                <Link to="/message" className="btn btn-primary d-flex align-items-center px-4">
                <FaEnvelope className="me-2"/>
                send Message
                </Link>
                <Link to="/create-group" className="btn btn-success d-flex align-items-center px-4">
                <FaUsers className="me-2"/>
                Create Group
                </Link>
            </div>
            </div>
        </Layout>
    );
    // return (
    //     <Layout>
    //         <div className="container mt-5 text-center">
    //             {/* Add the logo centered */}
    //             <img src={myImage} alt="Logo" style={{ height: 100, width: 160 }} className="mb-4" />
    //             <h1 className="mb-4">Welcome</h1>
    //             <div className="d-flex justify-content-around">
    //                 <Link to="/message" className="btn btn-primary d-flex align-items-center px-4">
    //                     <FaEnvelope className="me-2" />
    //                     Send Message
    //                 </Link>
    //                 <Link to="/create-group" className="btn btn-success d-flex align-items-center px-4">
    //                     <FaUsers className="me-2" />
    //                     Create Group
    //                 </Link>
    //             </div>
    //         </div>
    //     </Layout>
    // );
}

export default WelcomePage;
