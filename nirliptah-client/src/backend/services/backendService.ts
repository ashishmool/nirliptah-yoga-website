import axios from "axios";

export const signup = async ({ email, role }) => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/register", {
            email,
            role,
        });
        return response.data;
    } catch (error) {
        console.error("Error during signup:", error);
        throw error;
    }
};
