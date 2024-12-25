import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/retreats"; // Backend base URL

// Fetch all retreats
export const fetchRetreats = async (setRetreats, setFilteredRetreats) => {
    try {
        const response = await axios.get(API_BASE_URL);
        const data = response.data || [];
        setRetreats(data);
        setFilteredRetreats(data);
    } catch (error) {
        console.error("Error fetching retreats:", error);
    }
};

// Create a new retreat
export const createRetreat = async (formData, navigate) => {
    try {
        await axios.post(`${API_BASE_URL}/save`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Retreat added successfully!");
        navigate("/admin/retreats");
    } catch (error) {
        console.error("Error adding retreat:", error);
        toast.error("Failed to add retreat.");
    }
};

// Update an existing retreat
export const updateRetreat = async (id, formData, navigate) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Retreat updated successfully!");
        navigate("/admin/retreats");
    } catch (error) {
        console.error("Error updating retreat:", error);
        toast.error("Failed to update retreat.");
    }
};

// Delete a retreat
export const deleteRetreat = async (id, setRetreats, setFilteredRetreats) => {
    if (window.confirm("Are you sure you want to delete this retreat?")) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            setRetreats((prev) => prev.filter((retreat) => retreat._id !== id));
            setFilteredRetreats((prev) => prev.filter((retreat) => retreat._id !== id));
            toast.success("Retreat deleted successfully!");
        } catch (error) {
            console.error("Error deleting retreat:", error);
            toast.error("Failed to delete retreat.");
        }
    }
};

// Fetch a specific retreat by ID for updating
export const fetchRetreatById = async (id, setFormData, setLoading) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        const data = response.data;

        // Format dates to "yyyy-MM-dd"
        const formattedStartDate = data.start_date
            ? new Date(data.start_date).toISOString().split("T")[0]
            : "";
        const formattedEndDate = data.end_date
            ? new Date(data.end_date).toISOString().split("T")[0]
            : "";

        setFormData({
            ...data,
            start_date: formattedStartDate,
            end_date: formattedEndDate,
            meals_info: data.meals_info.join(", "),
            featuring_events: data.featuring_events.join(", "),
            guests: data.guests.map((guest) => ({ name: guest.name, photo: null })),
            retreat_photo: [], // Reset for new uploads
        });

        setLoading(false);
    } catch (error) {
        console.error("Error fetching retreat:", error);
        setLoading(false);
        toast.error("Failed to fetch retreat details.");
    }
};
