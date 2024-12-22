import axios from "axios";

// Set the base URL for your backend
const BASE_URL = "http://localhost:5000/api";

// Create an Axios instance for API calls
const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Example: Fetch all accommodations
export const fetchAccommodations = async () => {
    try {
        const response = await apiClient.get("/accommodations");
        return response.data;
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        throw error;
    }
};

// Example: Create a new accommodation
export const createAccommodation = async (accommodation) => {
    try {
        const response = await apiClient.post("/accommodations/save", accommodation);
        return response.data;
    } catch (error) {
        console.error("Error creating accommodation:", error);
        throw error;
    }
};

// Add similar functions for other routes as needed
export const fetchPartners = async () => {
    try {
        const response = await apiClient.get("/partners");
        return response.data;
    } catch (error) {
        console.error("Error fetching partners:", error);
        throw error;
    }
};

export const createPartner = async (partner) => {
    try {
        const response = await apiClient.post("/partners/save", partner);
        return response.data;
    } catch (error) {
        console.error("Error creating partner:", error);
        throw error;
    }
};

export default apiClient;
