type SignupData = {
    email: string;
    password: string;
    medicalConditions: string;
};

export async function signup({ email, password, medicalConditions }: SignupData) {
    try {
        // Step 1: Send user registration data to your backend API
        const response = await fetch("http://localhost:5000/users/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email.toLowerCase(), // Ensure the email is in lowercase
                password,
                medicalConditions,
            }),
        });

        // Check if the response is not successful
        if (!response.ok) {
            const errorData = await response.json(); // Attempt to parse the error message
            throw new Error(errorData.message || "User registration failed");
        }

        // Parse the response data if necessary
        const userData = await response.json();

        // Optionally log success (or further process userData)
        console.log("User successfully registered:", userData);

        return true; // Return success
    } catch (error: any) {
        console.error("Signup error:", error.message);
        throw new Error(error.message || "An error occurred during signup");
    }
}
