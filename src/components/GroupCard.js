import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

const GroupCard = ({ group, onGroupClick, onSendMessageClick }) => {
    return (
        <Card style={{ width: '22rem', margin: '25px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <Card.Body>
                <Card.Title className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    {group.name}
                </Card.Title>
                <Card.Text style={{ minHeight: '5rem', marginBottom: '1.5rem', color: '#666' }}>
                    {group.description || 'No description available.'}
                </Card.Text>
                <div className="d-flex justify-content-between">
                    <Button
                        variant="outline-primary"
                        className="w-100 me-2"
                        onClick={() => onGroupClick(group.id)}
                        style={{ fontSize: '1rem' }}
                    >
                        View Messages
                    </Button>
                    <Button
                        variant="primary"
                        className="w-100"
                        onClick={() => onSendMessageClick(group.id)}
                        style={{ fontSize: '1rem' }}
                    >
                        Send Message
                    </Button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default GroupCard;
