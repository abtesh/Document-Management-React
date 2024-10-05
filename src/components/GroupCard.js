import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const GroupCard = ({ group, onGroupClick, onSendMessageClick }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            const token = localStorage.getItem('authToken');
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_BASE_URL}/groups/inbox/unread-count/${group.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setUnreadCount(response.data);
            } catch (error) {
                console.error('Error fetching unread count:', error);
            }
        };

        // Poll every 10 seconds to get the latest unread count
        fetchUnreadCount();
        const intervalId = setInterval(fetchUnreadCount, 10000);

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [group.id]);

    return (
        <Card style={{ width: '15rem', margin: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card.Body>
                <Card.Title className="text-primary" style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                    {group.name}
                </Card.Title>
                <Card.Text style={{ minHeight: '5rem', marginBottom: '1.5rem', color: '#666' }}>
                    {group.description || 'No description available.'}
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="outline-primary"
                        className="w-100 me-2 position-relative"
                        onClick={() => onGroupClick(group.id)}
                        style={{ fontSize: '1rem' }}
                    >
                        View
                        {unreadCount > 0 && (
                            <span className="badge bg-danger position-absolute top-0 start-100 translate-middle">
                                {unreadCount}
                            </span>
                        )}
                    </Button>
                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => onSendMessageClick(group.id)}
                        style={{ fontSize: '1rem' }}
                    >
                        Send
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default GroupCard;
 