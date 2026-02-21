import axios from "axios";
import { toast } from "sonner";

const API_CATEGORY_URL = "http://localhost:5000/api/workshop-categories"; // Backend base URL for workshop categories

// Fetch all workshop categories
export const fetchWorkshopCategories = async (setCategories: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
        const response = await axios.get(API_CATEGORY_URL);
        const data = response.data || [];
        setCategories(data);
    } catch (error) {
        toast.error("Error fetching workshop categories!");
        console.error("Error fetching workshop categories:", error);
    }
};

// Fetch workshop category by ID
export const fetchWorkshopCategoryById = async (id: string, setCategory: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await axios.get(`${API_CATEGORY_URL}/${id}`);
        const data = response.data || {};
        setCategory(data);
    } catch (error) {
        toast.error("Error fetching workshop category data!");
        console.error("Error fetching workshop category data:", error);
    }
};

// Create a new workshop category
export const createWorkshopCategory = async (formData: FormData, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true);
    try {
        const response = await axios.post(`${API_CATEGORY_URL}/save`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Workshop category created successfully!");
        return response.data;
    } catch (error) {
        toast.error("Error creating workshop category!");
        console.error("Error creating workshop category:", error);
    } finally {
        setLoading(false);
    }
};

// Update an existing workshop category
export const updateWorkshopCategory = async (
    id: string,
    formData: FormData,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        const response = await axios.put(`${API_CATEGORY_URL}/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Workshop category updated successfully!");
        return response.data;
    } catch (error) {
        toast.error("Error updating workshop category!");
        console.error("Error updating workshop category:", error);
    } finally {
        setLoading(false);
    }
};

// Delete a workshop category by ID
export const deleteWorkshopCategory = async (
    id: string,
    setCategories: React.Dispatch<React.SetStateAction<any[]>>
) => {
    try {
        await axios.delete(`${API_CATEGORY_URL}/delete/${id}`);
        toast.success("Workshop category deleted successfully!");
        setCategories((prevCategories) => prevCategories.filter((category) => category.id !== id));
    } catch (error) {
        toast.error("Error deleting workshop category!");
        console.error("Error deleting workshop category:", error);
    }
};
