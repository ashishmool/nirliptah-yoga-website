// instructorService.ts
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/instructors"; // Backend base URL

// Get all instructors
export const fetchInstructors = async (setInstructors) => {
    try {
        const response = await axios.get(API_BASE_URL);
        setInstructors(response.data);
    } catch (error) {
        console.error("Error fetching instructors:", error);
    }
};

// Create a new instructor
export const createInstructor = async (data) => {
    try {
        await axios.post(`${API_BASE_URL}/save`, data);
    } catch (error) {
        throw new Error("Failed to add instructor");
    }
};

// Update an existing instructor
export const updateInstructor = async (id, formDataObj, navigate) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, formDataObj);
        toast.success("Instructor updated successfully!");
        navigate("/admin/instructors");
    } catch (error) {
        console.error("Error updating instructor:", error);
    }
};

// Delete an instructor
export const deleteInstructor = async (id) => {
    if (window.confirm("Are you sure you want to delete this instructor?")) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            toast.success("Delete Success!");
        } catch (error) {
            console.error("Error deleting instructor:", error);
        }
    }
};

// Fetch a specific instructor by ID
export const fetchInstructorById = async (id, setFormData) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getById/${id}`);
        const instructor = response.data;

        setFormData({
            name: instructor.name || "",
            specialization: instructor.specialization || [],
            rating: instructor.rating || 0,
        });
    } catch (error) {
        console.error("Error fetching instructor:", error);
        alert("Failed to load instructor data.");
    }
};
