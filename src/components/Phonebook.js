import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://10.1.22.176:8080";

const PhoneBook = () => {
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [branches, setBranches] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedBranch, setSelectedBranch] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Fetch all regions
  useEffect(() => {
    axios
      .get(`${BASE_URL}/phoneBook/regions`)
      .then((response) => {
        setRegions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching regions:", error);
      });
  }, []);

  // Fetch districts based on the selected region
  useEffect(() => {
    if (selectedRegion) {
      axios
        .get(`${BASE_URL}/phoneBook/${selectedRegion}/districts`)
        .then((response) => {
          setDistricts(response.data);
        })
        .catch((error) => {
          console.error("Error fetching districts:", error);
        });
    }
  }, [selectedRegion]);

  // Fetch branches based on the selected district
  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(
          `${BASE_URL}/phoneBook/${selectedRegion}/districts/${selectedDistrict}/branches`
        )
        .then((response) => {
          setBranches(response.data);
        })
        .catch((error) => {
          console.error("Error fetching branches:", error);
        });
    }
  }, [selectedDistrict]);

  // Search for branches by name
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      axios
        .get(`${BASE_URL}/phoneBook/search/branch`, {
          params: { branchName: searchQuery },
        })
        .then((response) => {
          setSearchResults(response.data);
        })
        .catch((error) => {
          console.error("Error searching for branches:", error);
        });
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Phone Book</h2>

      {/* Search Section */}
      <form style={styles.searchContainer} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search by branch name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchButton}>
          Search
        </button>
      </form>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div style={styles.resultsContainer}>
          <h3 style={styles.subTitle}>Search Results</h3>
          {searchResults.map((branch) => (
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
      )}

      {/* Region Dropdown */}
      <div style={styles.dropdownContainer}>
        <label style={styles.label}>Region:</label>
        <select
          style={styles.select}
          value={selectedRegion}
          onChange={(e) => {
            setSelectedRegion(e.target.value);
            setDistricts([]);
            setBranches([]);
            setSelectedBranch(null);
          }}
        >
          <option value="">Select a Region</option>
          {regions.map((region) => (
            <option key={region.id} value={region.id}>
              {region.regionName}
            </option>
          ))}
        </select>
      </div>

      {/* District Dropdown */}
      {selectedRegion && (
        <div style={styles.dropdownContainer}>
          <label style={styles.label}>District:</label>
          <select
            style={styles.select}
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setBranches([]);
              setSelectedBranch(null);
            }}
          >
            <option value="">Select a District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.name}>
                {district.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Branch Dropdown */}
      {selectedDistrict && (
        <div style={styles.dropdownContainer}>
          <label style={styles.label}>Branch:</label>
          <select
            style={styles.select}
            value={selectedBranch ? selectedBranch.branchId : ""}
            onChange={(e) => {
              const branchId = e.target.value;
              const selected = branches.find(
                (branch) => branch.branchId === branchId
              );
              setSelectedBranch(selected);
            }}
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

      {/* Branch Details */}
      {selectedBranch && (
        <div style={styles.branchDetails}>
          <h3 style={styles.subTitle}>Branch Details</h3>
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

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "600px",
    margin: "0 auto",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  title: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
  },
  searchContainer: {
    display: "flex",
    marginBottom: "20px",
  },
  searchInput: {
    flex: 1,
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  searchButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007BFF",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  resultsContainer: {
    marginBottom: "20px",
  },
  dropdownContainer: {
    marginBottom: "15px",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "5px",
    color: "#555",
  },
  select: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
  },
  branchDetails: {
    marginTop: "20px",
    padding: "15px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  subTitle: {
    textAlign: "center",
    color: "#333",
    marginBottom: "15px",
  },
};

export default PhoneBook;
