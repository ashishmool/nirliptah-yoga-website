// mockSession.ts

// Simulating a user's session (you can extend this logic as needed)
const session = {
    id: '12345',
    userId: 'user_001',
    valid: false,
};

// Mock session function
export default async function mockSession() {
    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms delay
    return session.valid ? session : null; // Return session if valid, null otherwise
}
