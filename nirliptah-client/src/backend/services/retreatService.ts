import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/retreats"; // Backend base URL

// Get all retreats
export const getAllRetreats = async () => {
    const response = await axios.get(`${API_BASE_URL}`);
    return response.data;
};

// Get retreat by ID
export const getRetreatById = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data;
};

// Create a new retreat
export const createRetreat = async (retreatData) => {
    const response = await axios.post(`${API_BASE_URL}/save`, retreatData);
    return response.data;
};

// Update an existing retreat
export const updateRetreat = async (id, retreatData) => {
    const response = await axios.put(`${API_BASE_URL}/update/${id}`, retreatData);
    return response.data;
};

// Delete a retreat
export const deleteRetreat = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
    return response.data;
};
