// import { account } from "@/backend/configs/config";
//
//
// export default async function resetPassword(email: string) {
//     const res = await account.createRecovery(
//         email,
//         `${window.location.origin}/reset`
//     ).then(() => {
//         return true
//     }).catch(() => {
//         return false
//     })
//
//     return res
// }

export default async function resetPassword(email: string) {
    try {
        const response = await fetch("https://your-backend-api.com/auth/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                resetLink: `${window.location.origin}/reset`
            }),
        });

        if (!response.ok) {
            throw new Error("Password reset request failed");
        }

        return true; // Password reset request was successful
    } catch (error) {
        console.error("Reset password error:", error.message);
        return false; // Something went wrong
    }
}
