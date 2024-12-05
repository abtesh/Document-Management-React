import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './RegionDistrictBranchSelector.css'; // Import the custom CSS

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const RegionDistrictBranchSelector = () => {
    const { regionId } = useParams(); // Get the regionId from the URL
    const [regionName, setRegionName] = useState(""); // State for the region name
    const [districts, setDistricts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (regionId) {
            // Fetch the region name based on regionId
            axios
                .get(`${BASE_URL}/phoneBook/regions/${regionId}`)
                .then((response) => {
                    setRegionName(response.data.regionName); // Set the region name
                })
                .catch((err) => console.error('Error fetching region name:', err));

            // Fetch districts for the region
            axios
                .get(`${BASE_URL}/phoneBook/${regionId}/districts`)
                .then((response) => setDistricts(response.data))
                .catch((err) => console.error('Error fetching districts:', err));
        }
    }, [regionId]);

    useEffect(() => {
        if (selectedDistrict) {
            axios
                .get(`${BASE_URL}/phoneBook/${regionId}/districts/${selectedDistrict}/branches`)
                .then((response) => setBranches(response.data))
                .catch((err) => console.error('Error fetching branches:', err));
        } else {
            setBranches([]);
            setSelectedBranch(null);
        }
    }, [selectedDistrict, regionId]);

    const handleBranchSelect = (branchId) => {
        const selected = branches.find(branch => branch.branchId === branchId);
        setSelectedBranch(selected);
    };

    return (
        <div className="container py-5">
            <h2 className="text-center mb-4">Select District and Branch {}</h2>
            
            {/* District Dropdown */}
            {districts.length > 0 && (
                <div className="form-group mb-3">
                    <label htmlFor="district" className="form-label">District:</label>
                    <select
                        id="district"
                        className="form-select"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                    >
                        <option value="">Select a District</option>
                        {districts.map((district) => (
                            <option key={district.id} value={district.name}>
                                {district.name} - {district.districtManagerName} ({district.districtPhone})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Branch Dropdown */}
            {selectedDistrict && branches.length > 0 && (
                <div className="form-group mb-3">
                    <label htmlFor="branch" className="form-label">Branch:</label>
                    <select
                        id="branch"
                        className="form-select"
                        value={selectedBranch ? selectedBranch.branchId : ""}
                        onChange={(e) => handleBranchSelect(e.target.value)}
                    >
                        <option value="">Select a Branch</option>
                        {branches.map((branch) => (
                            <option key={branch.branchId} value={branch.branchId}>
                                {branch.branchName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Display Branch Details */}
            {selectedBranch && (
                <div className="branch-details mt-4">
                    <h3>Branch Details</h3>
                    <p><strong>Branch Name:</strong> {selectedBranch.branchName}</p>
                    <p><strong>Manager Name:</strong> {selectedBranch.branchManagerName}</p>
                    <p><strong>Manager Phone:</strong> {selectedBranch.branchManagerPhone}</p>
                    <p><strong>Landline:</strong> {selectedBranch.branchPhoneNumber}</p>
                    <p><strong>Fax:</strong> {selectedBranch.branchFax}</p>
                    <p><strong>PO Box:</strong> {selectedBranch.branchPOBox}</p>
                </div>
            )}
        </div>
    );
};

export default RegionDistrictBranchSelector;
