import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Dropdown, FormControl, Card } from 'react-bootstrap';
import Layout from './Layout';

function CreateIndividualMessage() {
  const [receiverEmail, setReceiverEmail] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Allowed file types
  const allowedFileTypes = [
    "application/pdf",                  // PDF
    "application/msword",               // DOC
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "text/plain",                       // TXT
    "application/vnd.ms-excel",         // XLS
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // XLSX
    "application/vnd.ms-powerpoint",    // PPT
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    "image/jpeg",                       // JPG
    "image/png",                        // PNG
    "image/gif"                         // GIF
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groups/users`, {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        setUsers(response.data);
      } catch (error) {
        setError("Error fetching users. Please try again later.");
      }
    };
    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);

    const matchedUsers = users.filter(user => user.email && user.email.toLowerCase().includes(query));
    
    setShowDropdown(matchedUsers.length > 0 && query !== "");
    setFilteredUsers(matchedUsers);
  };

  const handleEmailSelect = (user) => {
    setReceiverEmail(user.email);
    setReceiverId(user.id);
    setSearchQuery("");
    setShowDropdown(false);
    setSearching(false);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    
    // Check if all attachments are of allowed types
    const invalidFiles = files.filter(file => !allowedFileTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError("One or more files have unsupported formats. Please upload only valid file types.");
      setAttachments([]); // Clear attachments if invalid files are found
    } else {
      setAttachments(files);
      setError(null); // Clear any previous error
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const isValidEmail = /\S+@\S+\.\S+/.test(receiverEmail);
    if (!isValidEmail) {
      setError("Receiver's Email is required and must be a valid email format.");
      return;
    }

    if (!receiverId && !users.some(user => user.email === receiverEmail)) {
      setError("Receiver's ID is required. Please select from the dropdown or enter a valid email.");
      return;
    }

    if (attachments.length === 0 && content.trim() === "") {
      setError("Message content or attachment is required.");
      return;
    }

    // Ensure attachments are valid before sending
    if (error) {
      return; // Stop submission if there's an error
    }

    const token = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append("receiverEmail", receiverEmail);
    formData.append("content", content);

    attachments.forEach((attachment) => {
      formData.append("attachments", attachment);
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/messenger/create`, formData, {
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess("Message sent successfully.");
      setReceiverEmail("");
      setReceiverId("");
      setContent("");
      setAttachments([]);
    } catch (error) {
      setError("Error sending message. Please try again.");
    }
  };

  return (
    <Layout>
      <div className="container mt-5" style={{ maxWidth: "600px" }}>
        <Card className="p-5 mx-auto shadow-lg">
          <h2 className="mb-4 text-center" style={{ fontWeight: "bold", fontSize: "28px" }}>
            Send Message
          </h2>
          {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label">Receiver's Email</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  value={receiverEmail}
                  onChange={e => setReceiverEmail(e.target.value)}
                  placeholder="Receiver's email"
                  required
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSearching(true)}
                >
                  Search
                </button>
              </div>
              {searching && (
                <div className="mt-3 position-relative">
                  <FormControl
                    type="text"
                    placeholder="Search for members..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="mb-3"
                  />
                  {searchQuery && filteredUsers.length > 0 ? (
                    <Dropdown.Menu show={showDropdown} style={{ width: '100%' }}>
                      {filteredUsers.map(user => (
                        <Dropdown.Item key={user.id} onClick={() => handleEmailSelect(user)}>
                          {user.email}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  ) : (
                    <p>No members found</p>
                  )}
                </div>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                value={content}
                onChange={handleContentChange}
                placeholder="Short and Precise"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="form-label">Attachments</label>
              <input type="file" className="form-control" onChange={handleAttachmentChange} multiple />
            </div>
            <div className="mb-3 form-check">
              <input 
              type="checkbox"
              className="form-check-input"
              name="confidential"/>
              <label className="form-check-label">confidential</label>
            </div>
            <div className="text-center">
              <button type="submit" className="btn btn-primary px-4">Send Message</button>
            </div>
            
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default CreateIndividualMessage;
