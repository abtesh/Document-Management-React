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
  const [privileges, setPrivileges] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false); // Track dropdown visibility

  const allowedFileTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.csv",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/jpeg",
    "image/png",
    "image/gif"
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
    setShowDropdown(!!query); // Show dropdown only if there's a query

    const matchedUsers = users.filter(user => user.email && user.email.toLowerCase().includes(query));
    setFilteredUsers(matchedUsers);
  };

  const handleEmailSelect = (user) => {
    setReceiverEmail(user.email);
    setReceiverId(user.id);
    setSearchQuery(user.email); // Set the selected email in the search bar
    setShowDropdown(false); // Hide the dropdown after selection
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleAttachmentChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => allowedFileTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      setError("Some files are not allowed. Only specific file types can be uploaded.");
      return;
    }

    setAttachments(validFiles);
    setPrivileges(validFiles.map(() => "view"));
  };

  const handlePrivilegeChange = (index, privilege) => {
    setPrivileges((prevPrivileges) => {
      const updatedPrivileges = [...prevPrivileges];
      updatedPrivileges[index] = privilege;
      return updatedPrivileges;
    });
  };

  const mapPrivilegeToBooleans = (privilege) => {
    return {
      canView: privilege === "view" || privilege === "download",
      canDownload: privilege === "download"
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!receiverId) {
      setError("Receiver is required. Please select a user from the list.");
      return;
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

      const messageId = response.data.id;
      const uploadedAttachments = response.data.attachments;

      if (!uploadedAttachments || uploadedAttachments.length !== attachments.length) {
        throw new Error("Mismatch between uploaded attachments and response data.");
      }

      const privilegePromises = uploadedAttachments.map((attachment, index) => {
        const { canView, canDownload } = mapPrivilegeToBooleans(privileges[index]);

        const params = new URLSearchParams();
        params.append("messageId", messageId);
        params.append("attachmentId", attachment);
        params.append("userId", receiverId);
        params.append("canView", canView.toString());
        params.append("canDownload", canDownload.toString());

        return axios.post(`${process.env.REACT_APP_API_BASE_URL}/downloadFiles/setFilePrivilege`, params, {
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
      });

      await Promise.all(privilegePromises);
      setSuccess("Message sent and privileges set successfully.");
      setReceiverEmail("");
      setReceiverId("");
      setContent("");
      setAttachments([]);
      setPrivileges([]);
      setSearchQuery("");
    } catch (error) {
      setError("Error sending message or setting privileges. Please try again.");
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
              <FormControl
                type="text"
                placeholder="Search for members..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="mb-3"
              />
              {showDropdown && filteredUsers.length > 0 && (
                <Dropdown.Menu show={true} style={{ width: '100%' }}>
                  {filteredUsers.map(user => (
                    <Dropdown.Item key={user.id} onClick={() => handleEmailSelect(user)}>
                      {user.email}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label">Message Content</label>
              <textarea
                className="form-control"
                value={content}
                onChange={handleContentChange}
                placeholder="Write your message here"
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="form-label">Attachments</label>
              <input type="file" className="form-control" onChange={handleAttachmentChange} multiple />
            </div>
            {attachments.map((attachment, index) => (
              <div key={index} className="mb-3">
                <select
                  className="form-select"
                  value={privileges[index] || "view"}
                  onChange={(e) => handlePrivilegeChange(index, e.target.value)}
                >
                  <option value="view">View Only</option>
                  <option value="download">Download</option>
                </select>
              </div>
            ))}
            <div className="text-center">
              <button type="submit" className="btn btn-primary btn-lg">
                Send
              </button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export default CreateIndividualMessage;
