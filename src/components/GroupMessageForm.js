import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Col, Row, ListGroup, InputGroup, FormControl, Button } from 'react-bootstrap';

const GroupMessageForm = () => {
    const { groupId } = useParams();
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [newMember, setNewMember] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [members, setMembers] = useState([]);

    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/groups/${groupId}/members`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMembers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching members', error);
            setError('Failed to fetch members.');
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [groupId]);

    const handleContentChange = (event) => {
        setContent(event.target.value);
    };

    const handleFileChange = (event) => {
        setAttachments(event.target.files);
    };

    const handleDeleteMember = async (memberId) => {
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            await axios.delete(
                `${process.env.REACT_APP_API_BASE_URL}/groups/removeMember`,
                {
                    params: {
                        groupId: groupId,
                        memberId: memberId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setSuccess('Member deleted successfully!');
            setMembers(members.filter((member) => member.id !== memberId));
        } catch (error) {
            console.error('Error deleting member', error);
            setError('Failed to delete member.');
        }
    };

    const handleAddMember = async () => {
        setError('');
        setSuccess('');
        try {
            const token = localStorage.getItem('authToken');
            await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/groups/${groupId}/addMembers`,
                [newMember],
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setSuccess('Member added successfully!');
            setNewMember('');
            fetchMembers();
        } catch (error) {
            console.error('Error adding member', error);
            setError('Failed to add member.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('groupId', groupId);
        formData.append('content', content);
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/groups/createMessage`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            setSuccess("Message sent successfully!");
            setContent('');
            setAttachments([]);
        } catch (error) {
            console.error('Error sending message', error);
            setError('Failed to send message.');
        }
    };

    return (
        <Layout>
            <Row className="container mt-5">
                <Col md={8}>
                    <Card className="p-5 shadow-lg">
                        <h2 className="mb-4">Group Message</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        {success && <div className="alert alert-success">{success}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    value={content}
                                    onChange={handleContentChange}
                                    rows="2"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Attachments</label>
                                <input
                                    className="form-control"
                                    type="file"
                                    multiple
                                    onChange={handleFileChange}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Send Message
                            </button>
                        </form>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="p-3 shadow-lg" style={{ minWidth: '350px' }}>
                        <h3>Group Members</h3>
                        <ListGroup className="list-group-flush">
                            {members.length > 0 ? (
                                members.map((member) => (
                                    <ListGroup.Item key={member.id} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {member.email}
                                        <Button variant="danger" size="sm" style={{ float: 'right' }} onClick={() => handleDeleteMember(member.id)}>
                                            Delete
                                        </Button>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <ListGroup.Item>No members available</ListGroup.Item>
                            )}
                        </ListGroup>
                        <div className="mt-4">
                            <h5>Add Member</h5>
                            <InputGroup className="mb-3">
                                <FormControl
                                    placeholder="Enter member email"
                                    value={newMember}
                                    onChange={(e) => setNewMember(e.target.value)}
                                />
                                <Button variant="outline-secondary" onClick={handleAddMember}>
                                    Add
                                </Button>
                            </InputGroup>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Layout>
    );
};

export default GroupMessageForm;
