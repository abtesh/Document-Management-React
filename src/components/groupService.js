import axios from 'axios';

const API_URL = 'http://localhost:8080/groups'; // Adjust the URL to match your Spring Boot endpoint


const getGroupsByUserId = async (token) => {
    const response = await axios.get(`${API_URL}/user`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return response.data;
};

export { getGroupsByUserId };
