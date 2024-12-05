import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const DistrictDetailsPage = () => {
  const { regionId, districtName } = useParams(); // Get regionId and districtName from the route parameters
  const [branches, setBranches] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Region ID:", regionId); // Debugging logs
    console.log("District Name:", districtName);

    if (!regionId || !districtName) {
      setError("Region ID or District Name is missing.");
      return;
    }

    axios
      .get(`${BASE_URL}/phoneBook/${regionId}/districts/${districtName}/branches`)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          setBranches(response.data);
          setError(""); // Clear any previous error
        } else {
          setBranches([]);
          setError("No branches found for this district.");
        }
      })
      .catch((error) => {
        console.error("Error fetching branches:", error);
        setError("Failed to fetch branches. Please try again.");
      });
  }, [regionId, districtName]);

  if (!regionId || !districtName) {
    return (
      <div style={styles.container}>
        <h2 style={styles.title}>Branches</h2>
        <p style={styles.error}>Region ID or District Name is missing.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        Branches in {districtName} (Region ID: {regionId})
      </h2>

      {error && <p style={styles.error}>{error}</p>}

      {branches.length > 0 ? (
        <div style={styles.branchesList}>
          {branches.map((branch) => (
            <div key={branch.branchId} style={styles.branchDetails}>
              <p><strong>Branch Name:</strong> {branch.branchName}</p>
              <p><strong>Manager Name:</strong> {branch.branchManagerName}</p>
              <p><strong>Manager Phone:</strong> {branch.branchManagerPhone}</p>
              <p><strong>Landline:</strong> {branch.branchPhoneNumber}</p>
              <p><strong>Fax:</strong> {branch.branchFax}</p>
              <p><strong>PO Box:</strong> {branch.branchPOBox}</p>
            </div>
          ))}
        </div>
      ) : (
        !error && <p style={styles.noBranches}>No branches found for this district.</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    color: "#216df8",
    marginBottom: "20px",
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  branchesList: {
    display: "grid",
    gap: "15px",
  },
  branchDetails: {
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  noBranches: {
    textAlign: "center",
    color: "#666",
  },
};

export default DistrictDetailsPage;
