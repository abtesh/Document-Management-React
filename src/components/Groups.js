import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import GroupCard from './GroupCard';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchGroups = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/groups/user`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setGroups(response.data);
            } catch (error) {
                console.error('Error fetching groups:', error);
                // Optionally, you could show an error message here
            }
        };

        fetchGroups();
    }, []);

    const handleGroupClick = (groupId) => {
        navigate(`/groups/${groupId}/messages`);
    };

    const handleSendMessageClick = (groupId) => {
        navigate(`/groups/${groupId}`);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredGroups = groups.filter((group) =>
        group.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <div className="container mt-4 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '10px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0 text-primary" style={{ paddingLeft: '1rem' }}>Your Groups</h2>
                    <div className="input-group" style={{ maxWidth: '300px' }}>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Groups"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                        <div className="input-group-append">
                            <span className="input-group-text">
                                <i className="bi bi-search"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {filteredGroups.length > 0 ? (
                        filteredGroups.map((group) => (
                            <div className="col-md-6 mb-4" key={group.id}>
                                <GroupCard
                                    group={group}
                                    onGroupClick={() => handleGroupClick(group.id)}
                                    onSendMessageClick={() => handleSendMessageClick(group.id)}
                                />
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center">
                            <p>No groups found.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Groups;
