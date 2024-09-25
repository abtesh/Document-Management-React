import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Inbox.css';

const VIEW_OR_DOWNLOAD_URL = `${process.env.REACT_APP_API_BASE_URL}/downloadFiles/viewAttachment`;

const Inbox = () => {
    const [messages, setMessages] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 10;

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messenger/inbox`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const sortedMessages = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMessages(sortedMessages);
        } catch (err) {
            console.error('Error fetching messages', err);
        }
    };

    const handleSearch = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messenger/searchInbox`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    senderEmail: searchQuery, // You can add attachment search logic here too
                }
            });
            setMessages(response.data);
        } catch (err) {
            console.error('Error searching messages', err);
        }
    };

    const handleAttachmentClick = async (fullFileName) => {
        try {
            const token = localStorage.getItem('authToken');
            const fullEndpoint = `${VIEW_OR_DOWNLOAD_URL}?fileName=${encodeURIComponent(fullFileName)}`;
            
            const response = await axios.get(fullEndpoint, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });
            
            const contentType = response.headers['content-type'];
            const contentDisposition = response.headers['content-disposition'];
            
            const blob = new Blob([response.data], { type: contentType });
            const url = window.URL.createObjectURL(blob);
            
            // Determine if the content-disposition header suggests inline or attachment
            const isAttachment = contentDisposition && contentDisposition.includes('attachment');
            const isPdf = contentType === 'application/pdf';
            const isImage = contentType.startsWith('image/');
            
            if (isPdf || (isImage && !isAttachment)) {
                // For PDFs and images (not suggested for download)
                const newTab = window.open(url, '_blank');
                if (newTab) {
                    newTab.focus();
                } else {
                    console.error('Failed to open file in a new tab.');
                }
            } else if (isAttachment || !isImage && !isPdf) {
                // For other files or if download is suggested
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fullFileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } else {
                // For other viewable files
                const newTab = window.open(url, '_blank');
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
    const getOriginalFileName = (fullFileName) => {
        return fullFileName.split('_').slice(1).join('_');
    };

    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage);

    const totalPages = Math.ceil(messages.length / messagesPerPage);

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderPagination = () => (
        Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
            <li key={pageNumber} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                <button className="page-link" onClick={() => handlePageClick(pageNumber)}>
                    {pageNumber}
                </button>
            </li>
        ))
    );

    return (
        <Layout>
            <div className="container my-4">
                <div className="d-flex justify-content-end mb-3">
                    <input
                        type="text"
                        className="form-control w-25"
                        placeholder="sender's email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
        <button className="btn btn-secondary ml-2" onClick={handleSearch}>Search</button>
                    </div>
                <h1 className="mb-4 inbox-title">Inbox</h1>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Sender</th>
                                <th scope="col">Date</th>
                                <th scope="col">Message</th>
                                <th scope="col">Attachments</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="text-center">No Messages Found</td>
                                </tr>
                            ) : (
                                currentMessages.map((message, index) => (
                                    <tr key={index}>
                                        <td>{message.senderEmail}</td>
                                        <td>{new Date(message.date).toLocaleString()}</td>
                                        <td>{message.content || 'No Subject'}</td>
                                        <td>
                                            {message.attachments && message.attachments.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {message.attachments.map((attachment, index) => (
                                                        <li key={index}>
                                                            <button
                                                                className="btn btn-link p-0"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleAttachmentClick(attachment);
                                                                }}
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
                            )}
                        </tbody>
                    </table>
                </div>
                <nav aria-label="Page navigation example">
                    <ul className="pagination justify-content-center">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageClick(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                &laquo; Previous
                            </button>
                        </li>
                        {renderPagination()}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => handlePageClick(currentPage + 1)}
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

export default Inbox;
