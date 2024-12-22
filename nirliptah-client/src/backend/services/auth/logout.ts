// import { account } from "@/backend/configs/config"
//
//
// export async function logout() {
//     const isLoggedOut = await account.deleteSession('current');
//     return isLoggedOut ? true : false
// }
export async function logout() {
    try {
        const response = await fetch("https://your-backend-api.com/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Include the token or any necessary credentials if required
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        // Clear local storage or session data if needed
        localStorage.removeItem("authToken");
        return true; // Successfully logged out
    } catch (error) {
        console.error("Logout error:", error.message);
        return false; // Logout failed
    }
}
