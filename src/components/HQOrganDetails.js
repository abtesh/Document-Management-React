import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';  // Import the CSS file

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const HQOrganDetails = () => {
    const [hqTypes, setHQTypes] = useState([]);          
    const [structures, setStructures] = useState([]);    
    const [details, setDetails] = useState([]);          
    const [selectedType, setSelectedType] = useState(''); 
    const [selectedStructure, setSelectedStructure] = useState(''); 

    useEffect(() => {
        axios
            .get(`${BASE_URL}/phoneBook/hq/types`)
            .then((response) => setHQTypes(response.data))
            .catch((err) => console.error('Error fetching HQ types:', err));
    }, []);

    useEffect(() => {
        if (selectedType) {
            axios
                .get(`${BASE_URL}/phoneBook/hq/structures/${selectedType}`)
                .then((response) => {
                    setStructures(response.data);
                    setSelectedStructure('');
                    setDetails([]);
                })
                .catch((err) => console.error('Error fetching structures:', err));
        }
    }, [selectedType]);

    const fetchDetails = (structureName) => {
        setSelectedStructure(structureName);
        axios
            .get(`${BASE_URL}/phoneBook/hq/details/${selectedType}/${structureName}`)
            .then((response) => setDetails(response.data))
            .catch((err) => console.error('Error fetching details:', err));
    };

    return (
        <div className="container">
            <h2>Head Quarters</h2>

            <div>
                <h3>Select Type</h3>
                <select onChange={(e) => setSelectedType(e.target.value)} value={selectedType}>
                    <option value="">Select Type</option>
                    {hqTypes.map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>

            {selectedType && (
                <div>
                    <h3>Select Structure</h3>
                    {structures.length > 0 ? (
                        <select onChange={(e) => fetchDetails(e.target.value)} value={selectedStructure}>
                            <option value="">Select Structure</option>
                            {structures.map((structure) => (
                                <option key={structure} value={structure}>
                                    {structure}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <p>No structures available for this type.</p>
                    )}
                </div>
            )}

{selectedStructure && details.length > 0 && (
    <div>
        <h3>
            {selectedStructure}</h3>
        <ul>
            {details.map((detail) => (
                <li key={detail.id}>
                    <div>
                        <strong>Landline:</strong> {detail.landline || "Not available"}
                    </div>
                    {/* Conditionally render Fax if it exists */}
                    {detail.fax && (
                        <div>
                            <strong>Fax:</strong> {detail.fax}
                        </div>
                    )}
                </li>
            ))}
        </ul>
    </div>
)}
        </div>
    );
};

export default HQOrganDetails;
