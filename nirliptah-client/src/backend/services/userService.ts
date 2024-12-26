import axios from "axios";
import { toast } from "sonner";

const API_BASE_URL = "http://localhost:5000/api/users"; // Backend base URL

// Fetch all users
export const fetchUsers = async (setUsers: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
        const response = await axios.get(API_BASE_URL);
        const data = response.data || [];
        setUsers(data);
    } catch (error) {
        toast.error("Error fetching users!");
        console.error("Error fetching users:", error);
    }
};

// Fetch user by ID
export const fetchUserById = async (id: string, setUser: React.Dispatch<React.SetStateAction<any>>) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getById/${id}`);
        const data = response.data || {};
        setUser(data);
    } catch (error) {
        toast.error("Error fetching user data!");
        console.error("Error fetching user data:", error);
    }
};

// Create a new user with an optional profile picture
export const createUser = async (formData: FormData, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    setLoading(true);
    try {
        const response = await axios.post(`${API_BASE_URL}/save`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User created successfully!");
        return response.data;
    } catch (error) {
        toast.error("Error creating user!");
        console.error("Error creating user:", error);
    } finally {
        setLoading(false);
    }
};

// Update an existing user by ID with an optional file upload
export const updateUser = async (
    id: string,
    formData: FormData,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        const response = await axios.put(`${API_BASE_URL}/update/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully!");
        return response.data;
    } catch (error) {
        toast.error("Error updating user!");
        console.error("Error updating user:", error);
    } finally {
        setLoading(false);
    }
};

// Partially update an existing user by ID with an optional file upload
export const patchUser = async (
    id: string,
    formData: FormData,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setLoading(true);
    try {
        const response = await axios.patch(`${API_BASE_URL}/patch/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("User updated successfully!");
        return response.data;
    } catch (error) {
        toast.error("Error partially updating user!");
        console.error("Error partially updating user:", error);
    } finally {
        setLoading(false);
    }
};

// Delete a user by ID
export const deleteUser = async (
    id: string,
    setUsers: React.Dispatch<React.SetStateAction<any[]>>
) => {
    try {
        await axios.delete(`${API_BASE_URL}/delete/${id}`);
        toast.success("User deleted successfully!");
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
        toast.error("Error deleting user!");
        console.error("Error deleting user:", error);
    }
};
