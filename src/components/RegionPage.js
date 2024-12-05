import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const RegionPage = () => {
    const { regionId } = useParams();
    const [districts, setDistricts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        setError('');
        axios
            .get(`${BASE_URL}/phoneBook/${regionId}/districts`)
            .then((response) => {
                setDistricts(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching districts:', err);
                setError('Failed to load districts. Please try again.');
                setLoading(false);
            });
    }, [regionId]);

    const handleDistrictClick = (districtId) => {
        navigate(`/district/${districtId}`);
    };

    if (loading) return <p>Loading districts...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h2>Districts in Selected Region</h2>
            {districts.length === 0 ? (
                <p>No districts found for this region.</p>
            ) : (
                districts.map((district) => (
                    <div
                        key={district.id}
                        className="district-link"
                        onClick={() => handleDistrictClick(district.id)}
                    >
                        {district.name}
                    </div>
                ))
            )}
        </div>
    );
};

export default RegionPage;
