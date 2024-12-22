import axios from "axios";

/**
 * Checks the user's session by verifying the token stored in localStorage.
 * Sends a request to the backend to validate the token.
 *
 * @returns {Promise<boolean>} Returns true if the session is valid, otherwise false.
 */
export async function checkSession(): Promise<boolean> {
    try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem("token");

        // If no token exists, session is not valid
        if (!token) {
            return false;
        }

        // Validate the token with the backend
        const response = await axios.get("http://localhost:5000/api/auth/validate-session", {
            headers: {
                Authorization: `Bearer ${token}`, // Pass the token as a Bearer token
            },
        });

        // If the response is successful, the session is valid
        return response.status === 200;
    } catch (error) {
        console.error("Error validating session:", error);
        return false;
    }
}
