import React, { useState } from 'react';
import axios from 'axios';

function MessageForm() {
    const [receiverEmail, setReceiverEmail] = useState('');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [objectId, setObjectId] = useState(null);
    const [message, setMessage] = useState('');

    const handleAttachmentChange = (e) => {
        setAttachments(e.target.files);
    };

    const handleCreateMessage = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('receiverEmail', receiverEmail);
        formData.append('content', content);
        for (let i = 0; i < attachments.length; i++) {
            formData.append('attachments', attachments[i]);
        }

        try {
            const response = await axios.post('/api/messages/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setObjectId(response.data.id);  // Assuming the backend returns the message ID
            setMessage('Message created successfully.');
        } catch (error) {
            console.error('Error creating message:', error);
            setMessage('Failed to create message.');
        }
    };

    const handleSendMessage = async () => {
        if (!objectId) return;

        try {
            const response = await axios.post(`/api/messages/send/${objectId}`);
            setMessage('Message sent successfully.');
        } catch (error) {
            console.error('Error sending message:', error);
            setMessage('Failed to send message.');
        }
    };

    return (
        <div>
            <form onSubmit={handleCreateMessage}>
                <div>
                    <label>Receiver Email:</label>
                    <input
                        type="email"
                        value={receiverEmail}
                        onChange={(e) => setReceiverEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Content:</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    ></textarea>
                </div>
                <div>
                    <label>Attachments:</label>
                    <input
                        type="file"
                        multiple
                        onChange={handleAttachmentChange}
                    />
                </div>
                <button type="submit">Create Message</button>
            </form>

            {objectId && (
                <button onClick={handleSendMessage}>Send Message</button>
            )}

            {message && <p>{message}</p>}
        </div>
    );
}

export default MessageForm;
