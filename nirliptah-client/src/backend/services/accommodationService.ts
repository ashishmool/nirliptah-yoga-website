// accommodationService.ts
import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/accommodations"; // Backend base URL

// Get all accommodations
export const fetchAccommodations = async (setAccommodations) => {
    try {
        const response = await axios.get(API_BASE_URL);
        setAccommodations(response.data);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
    }
};

// Create a new accommodation
export const createAccommodation = async (data: FormData) => {
    try {
        await axios.post("http://localhost:5000/api/accommodations/save", data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    } catch (error) {
        throw new Error("Failed to add accommodation");
    }
};

// Update an existing accommodation
export const updateAccommodation = async (id, formDataObj, navigate) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, formDataObj, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Accommodation updated successfully!");
        navigate("/admin/accommodations");
    } catch (error) {
        console.error("Error updating accommodation:", error);
    }
};

// Delete an accommodation
export const deleteAccommodation = async (id) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            toast.success("Delete Success!");
        } catch (error) {
            console.error("Error deleting accommodation:", error);
        }
    }
};

// Fetch a specific accommodation by ID
// Fetch a specific accommodation by ID
// Fetch a specific accommodation by ID
// Fetch a specific accommodation by ID
export const fetchAccommodationById = async (id, setFormData, setImagePreview) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getById/${id}`);
        const accommodation = response.data;

        setFormData({
            name: accommodation.name || "",
            description: accommodation.description || "",
            price_per_night: accommodation.price_per_night || 0,
            location: accommodation.location || "",
            max_occupancy: accommodation.max_occupancy || 1,
            available_rooms: accommodation.available_rooms || 0,
            amenities: Array.isArray(accommodation.amenities)
                ? accommodation.amenities.join(", ") // Join array elements into a comma-separated string
                : accommodation.amenities || "", // Handle the case where amenities might not be an array
            photo: null, // Don't auto-load photo into form data
        });

        if (accommodation.photo) {
            setImagePreview(accommodation.photo); // Set existing photo as preview if available
        }
    } catch (error) {
        console.error("Error fetching accommodation:", error);
        alert("Failed to load accommodation data.");
    }
};



