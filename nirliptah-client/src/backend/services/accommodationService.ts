import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/accommodations";

// Fetch all accommodations
export const fetchAccommodations = async (setAccommodations: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
        const response = await axios.get(API_BASE_URL);
        setAccommodations(response.data);
    } catch (error) {
        console.error("Error fetching accommodations:", error);
        toast.error("Failed to fetch accommodations.");
    }
};

// Fetch a specific accommodation by ID
export const fetchAccommodationById = async (
    id: string,
    setFormData: React.Dispatch<React.SetStateAction<any>>,
    setImagePreview: React.Dispatch<React.SetStateAction<string | null>>
) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        const accommodation = response.data;

        setFormData({
            name: accommodation.name || "",
            description: accommodation.description || "",
            location: accommodation.location || "",
            amenities: Array.isArray(accommodation.amenities)
                ? accommodation.amenities.join(", ")
                : accommodation.amenities || "",
            photo: null,
        });

        if (accommodation.photo) {
            setImagePreview(`http://localhost:5000${accommodation.photo}`);
        }
    } catch (error) {
        console.error("Error fetching accommodation:", error);
        toast.error("Failed to load accommodation data.");
    }
};

// Create a new accommodation
export const createAccommodation = async (data: FormData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/save`, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Accommodation created successfully!");
        return response.data;
    } catch (error) {
        console.error("Error creating accommodation:", error);
        throw new Error("Failed to create accommodation.");
    }
};

// Update an accommodation by ID
export const updateAccommodation = async (id: string, formData: FormData) => {
    try {
        await axios.put(`${API_BASE_URL}/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Accommodation updated successfully!");
    } catch (error) {
        console.error("Error updating accommodation:", error);
        toast.error("Failed to update accommodation.");
    }
};

// Delete an accommodation by ID
export const deleteAccommodation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this accommodation?")) {
        try {
            await axios.delete(`${API_BASE_URL}/delete/${id}`);
            toast.success("Accommodation deleted successfully!");
        } catch (error) {
            console.error("Error deleting accommodation:", error);
            toast.error("Failed to delete accommodation.");
        }
    }
};
