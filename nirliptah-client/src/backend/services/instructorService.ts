import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/instructors"; // Backend base URL

// Get all instructors
export const fetchInstructors = async () => {
    try {
        const response = await axios.get(API_BASE_URL);
        return response.data;
    } catch (error) {
        console.error("Error fetching instructors:", error);
        toast.error("Failed to fetch instructors.");
        return []; // Return an empty array as a fallback
    }
};

// Create a new instructor
export const createInstructor = async (data) => {
    try {
        await axios.post(`${API_BASE_URL}/save`, data);
        toast.success("Instructor added successfully!");
    } catch (error) {
        console.error("Error creating instructor:", error);
        toast.error("Failed to add instructor.");
        throw new Error("Failed to add instructor"); // Ensure error can be caught by the caller
    }
};

// Update an existing instructor
export const updateInstructor = async (id, formDataObj) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, formDataObj);
        toast.success("Instructor updated successfully!");
    } catch (error) {
        console.error("Error updating instructor:", error);
        toast.error("Failed to update instructor.");
        throw new Error("Failed to update instructor"); // Ensure error can be caught by the caller
    }
};

// Delete an instructor
export const deleteInstructor = async (id) => {
    try {
        await axios.delete(`${API_BASE_URL}/delete/${id}`);
        toast.success("Instructor deleted successfully!");
    } catch (error) {
        console.error("Error deleting instructor:", error);
        toast.error("Failed to delete instructor.");
        throw new Error("Failed to delete instructor"); // Ensure error can be caught by the caller
    }
};

// Fetch a specific instructor by ID
export const fetchInstructorById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getById/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching instructor:", error);
        toast.error("Failed to fetch instructor details.");
        throw new Error("Failed to fetch instructor details"); // Ensure error can be caught by the caller
    }
};
