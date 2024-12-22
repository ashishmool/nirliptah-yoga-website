// mockPasswordReset.ts

// Simulating a database of users
const mockDatabase = [
    { userId: 'user_001', secret: 'abcd1234', password: 'oldPassword' },
    { userId: 'user_002', secret: 'efgh5678', password: 'anotherPassword' },
];

// Mock password reset function
export default async function mockPasswordReset(
    userId: string,
    secret: string,
    newPassword: string
) {
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay

    // Find the user in the mock database
    const user = mockDatabase.find(u => u.userId === userId && u.secret === secret);

    if (!user) {
        throw new Error("Invalid userId or secret");
    }

    // Update the user's password
    user.password = newPassword;

    // Return success
    return true;
}
