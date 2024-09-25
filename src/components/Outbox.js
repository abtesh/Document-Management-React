import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SentMessages.css';


const SentMessages = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 10;

    useEffect(() => {
        fetchSentMessages();
    }, []);

    const getOriginalFileName = (fullFileName) => {
        return fullFileName.split('_').slice(1).join('_');
    };

    const fetchSentMessages = async () => {
        try {
            const token = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/messenger/sent`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Sort messages by date in descending order (latest messages first)
            const sortedMessages = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
            setMessages(sortedMessages);
        } catch (err) {
            console.error('Error fetching sent messages', err);
        }
    };

    const handleResendMessage = async (message) => {
        const timestamp = new Date().getTime();

        const updatedAttachments = message.attachments.map(attachment => {
            const parts = attachment.split('.');
            const extension = parts.pop();
            const baseName = parts.join('.');
            return `${baseName}_${timestamp}.${extension}`;
        });

        try {
            const token = localStorage.getItem('authToken');
            await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/messenger/resend/${message.id}`,
                { attachments: updatedAttachments },  // Send updated attachments
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            alert('Message resent successfully');
        } catch (error) {
            console.error("Error resending message:", error);
            alert('Error resending message');
        }
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
                <h1 className="mb-4 inbox-title">Sent Messages</h1>
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="thead-dark">
                            <tr>
                                <th scope="col">Date</th>
                                <th scope="col">Message</th>
                                <th scope="col">Receiver</th> {/* New column for receiver email */}
                                <th scope="col">Attachments</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMessages.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">No Sent Messages Found</td>
                                </tr>
                            ) : (
                                currentMessages.map((message, index) => (
                                    <tr key={index}>
                                        <td>{new Date(message.date).toLocaleString()}</td>
                                        <td>{message.content || 'No Subject'}</td>
                                        <td>{message.receiverEmail || 'Unknown Receiver'}</td> {/* Display receiver email */}
                                        <td>
                                            {message.attachments && message.attachments.length > 0 ? (
                                                <ul className="list-unstyled">
                                                    {message.attachments.map((attachment, index) => (
                                                        <li key={index}>
                                                            {getOriginalFileName(attachment)}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                'No Attachments'
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleResendMessage(message)}
                                            >
                                                Resend
                                            </button>
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

export default SentMessages;
