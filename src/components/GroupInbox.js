import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';


const GroupInbox = () => {
    const { groupId } = useParams();
    const [messages, setMessages] = useState([]);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 10;

    const VIEW_OR_DOWNLOAD_URL = process.env.REACT_APP_VIEW_OR_DOWNLOAD_URL;
    const GROUP_MESSAGES_URL = process.env.REACT_APP_GROUP_MESSAGES_URL;

    useEffect(() => {
        const fetchGroupMessages = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await axios.get(
                    `${GROUP_MESSAGES_URL}/${groupId}/messages`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Sort messages by date, most recent on top
                const sortedMessages = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setMessages(sortedMessages);
            } catch (error) {
                console.error('Error fetching group messages', error);
                setError('Failed to fetch group messages.');
            }
        };

        if (groupId) {
            fetchGroupMessages();
        } else {
            setError('Group ID is undefined.');
        }
    }, [groupId, GROUP_MESSAGES_URL]);

    const handleGroupAttachmentClick = async (fileName) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No authentication token found.');
            }
    
            // Add groupId to the URL
            const fullEndpoint = `${VIEW_OR_DOWNLOAD_URL}?fileName=${encodeURIComponent(fileName)}&groupId=${encodeURIComponent(groupId)}`;
    
            const response = await axios.get(fullEndpoint, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                responseType: 'blob'
            });
    
            const contentType = response.headers['content-type'];
            const contentDisposition = response.headers['content-disposition'];
            console.log("Content Type: " + contentType);
            console.log("Content Disposition: " + contentDisposition);
            
            const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
            const isAttachment = contentDisposition && contentDisposition.includes('attachment');
            const isInline = contentDisposition && contentDisposition.includes('inline');
        
            if (isAttachment) {
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName); // Specify the file name
                
                // Append to the body, click to download, and then remove the link
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else if (isInline) {
                const newTab = window.open(url, '_blank'); // Use the object URL here
                if (newTab) {
                    newTab.focus();
                } else {
                    console.error('Failed to open file in a new tab.');
                }
            }
        
            // Clean up the object URL
            window.URL.revokeObjectURL(url);
        
        } catch (err) {
            console.error('Error viewing attachment', err);
        }
        
    };
    

    // Extract the original file name from the full file name
    const getOriginalFileName = (fullFileName) => {
        const parts = fullFileName.split('_');
        return parts.slice(1).join('_');
    };

    // Pagination logic
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    const totalPages = Math.ceil(messages.length / messagesPerPage);

    // Handle page click
    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Generate pagination items
    const renderPagination = () => {
        const paginationItems = [];

        for (let i = 1; i <= totalPages; i++) {
            paginationItems.push(
                <li key={i} className={`page-item ${i === currentPage ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => handlePageClick(i)}>
                        {i}
                    </button>
                </li>
            );
        }

        return paginationItems;
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h2 className="mb-4 inbox-title">Group Inbox</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th>Sender</th>
                                <th>Message</th>
                                <th>Date</th>
                                <th>Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMessages.length > 0 ? (
                                currentMessages.map((message) => (
                                    <tr key={message.id}>
                                        <td>{message.senderEmail}</td>
                                        <td>{message.content}</td>
                                        <td>{new Date(message.date).toLocaleString()}</td>
                                        <td>
                                            {message.attachments && message.attachments.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {message.attachments.map((attachment, index) => (
                                                        <li key={index}>
                                                            <button
                                                                className="btn btn-primary btn-sm mt-2"
                                                                onClick={() => handleGroupAttachmentClick(attachment)}
                                                            >
                                                                 {getOriginalFileName(attachment)}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'No Attachments'
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No messages available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        {/* Previous Page */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo; Previous
                            </button>
                        </li>
                        {/* Page Numbers */}
                        {renderPagination()}
                        {/* Next Page */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Next &raquo;
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </Layout>
    );
};

export default GroupInbox;
