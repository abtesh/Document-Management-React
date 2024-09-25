import React, { useState } from "react";
import axios from "axios";

function AddMember() {
  const [formData, setFormData] = useState({
    email: ""
  });
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');

    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      // Assuming you have a group ID you want to use here
      const groupId = "YOUR_GROUP_ID"; // Replace with your group ID logic

      // Use the environment variable for the API base URL
      const apiUrl = `${process.env.REACT_APP_API_BASE_URL}/groups/${groupId}/addMembers`;

      await axios.post(
        apiUrl,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}` // Include token in headers
          }
        }
      );
      alert("Member added to group successfully");
      setFormData({
        email: ""
      });
      setError(null); // Clear any previous errors
    } catch (error) {
      setError("Error adding new member");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add New Board Member</h2>
      <input
        type="text"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter user's email"
        required
      />
      <button type="submit" className="add-member-button">
        <i className="fas fa-plus"></i> {/* Font Awesome Plus Icon */}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
}

export default AddMember;
