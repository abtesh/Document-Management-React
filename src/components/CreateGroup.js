import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, FormControl, Form, Button, Modal, Row, Col } from 'react-bootstrap';
import Layout from "./Layout";

function CreateGroupForm() {
    const [groupName, setGroupName] = useState("");
    const [groupDescription, setGroupDescription] = useState("");
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
                setFilteredUsers(response.data);
            } catch (error) {
                console.error("Error fetching users", error);
                setError("Error fetching users. Please try again later.");
            }
        };
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);

        setFilteredUsers(users.filter(user => 
            user.email && user.email.toLowerCase().includes(query)
        ));
    };

    const handleMemberToggle = (userId) => {
        setSelectedMembers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError("No authentication token found.");
            return;
        }

        const groupDto = {
            groupName: groupName,
            groupDescription: groupDescription,
            members: selectedMembers
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/groups/create`,
                groupDto,
                {
                    headers: {
                        Authorization: 'Bearer ' + token,
                        'Content-Type': 'application/json'
                    }
                }
            );

            setSuccess("Group created successfully!");
            setGroupName("");
            setGroupDescription("");
            setSelectedMembers([]);
        } catch (error) {
            console.error("Error creating group", error);
            setError("Error creating group. Please check the console for details.");
        }
    };

    return (
        <Layout>
            <div className="container mt-5" style={{ width: "500px" }}>
                <Card className="p-5 mx-auto shadow-lg">
                    <h2 className="text-center mb-4">Create New Group</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="groupName" className="form-label">Group Name</label>
                            <input
                                placeholder="Name"
                                type="text"
                                className="form-control"
                                id="groupName"
                                value={groupName}
                                onChange={(e) => setGroupName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="groupDescription" className="form-label">Group Description</label>
                            <textarea
                                className="form-control"
                                placeholder="Short Description"
                                id="groupDescription"
                                value={groupDescription}
                                onChange={(e) => setGroupDescription(e.target.value)}
                                rows="2"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <Button variant="primary" onClick={() => setShowModal(true)}>
                                Select Members ({selectedMembers.length})
                            </Button>
                        </div>

                        <Button type="submit" className="w-100 btn-primary">Create Group</Button>
                        {error && <div className="alert alert-danger mt-3">{error}</div>}
                        {success && <div className="alert alert-success mt-3">{success}</div>}
                    </form>
                </Card>
            </div>

            {/* Modal for selecting members */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
            <Modal.Header className="sticky-header" style={{position: 'sticky',top: 0,
            zIndex: 1000, // Ensures it stays above the rest of the modal content
            backgroundColor: 'white',
            padding: '1rem',
            borderBottom: '1px solid #dee2e6',
                }}>
        <Modal.Title className="ml-auto">Select Members</Modal.Title>
        <div style={{ width: 500 }}></div>
        <Button variant="primary" onClick={() => setShowModal(false)}>
                    Done
        </Button>
                </Modal.Header>
                <Modal.Body>
    <FormControl
        type="text"
        placeholder="Search for members..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="mb-3"
    />
    
    {/* Show the list only when there is a search query */}
    {searchQuery && filteredUsers.length > 0 ? (
        <Form.Group>
            <Row>
                {filteredUsers.map((user) => (
                    <Col md={6} key={user.id}>
                        <Form.Check
                            type="checkbox"
                            id={`user-${user.id}`}
                            label={user.email}
                            checked={selectedMembers.includes(user.id)}
                            onChange={() => handleMemberToggle(user.id)}
                        />
                    </Col>
                ))}
            </Row>
        </Form.Group>
    ) : searchQuery ? (
        <p>No members found</p>
    ) : (
        <p>Start typing to search for members</p>
    )}
</Modal.Body>
            </Modal>
        </Layout>
    );
}

export default CreateGroupForm;
