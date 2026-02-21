// import { account } from "@/backend/configs/config"
//
// type Login = {
//     email: string,
//     password: string,
// }
//
// export async function login({ email, password }: Login) {
//
//     const res = await account.createEmailPasswordSession(
//         email,
//         password,
//     ).then((res) => {
//         return res
//     }).catch((err) => {
//         return err.type
//     })
//
//    return res
// }

type Login = {
    email: string,
    password: string,
};

export async function login({ email, password }: Login) {
    try {
        const response = await fetch("https://your-backend-api.com/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.message || "Login failed");
        }

        const res = await response.json();
        return res; // Return the successful response (e.g., user details, token)
    } catch (error: any) {
        console.error("Login error:", error.message);
        return error.message; // Return the error message for display or handling
    }
}
