import { test, expect } from '@playwright/test';

test.describe('Authentication Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto('http://localhost:5173');
    });

    test('should open the login modal when clicking the login button', async ({ page }) => {
        // Click the login button
        await page.click('button:has-text("Login")');

        // Check if the login modal (dialog) is visible
        const loginModal = await page.locator('role=dialog');
        await expect(loginModal).toBeVisible();
    });


    test('should successfully log in with valid credentials for admin', async ({ page }) => {
        // Click the login button to open the login modal
        await page.click('button:has-text("Login")');

        // Fill in the email and password fields
        await page.fill('input[id="login-email"]', 'nirliptayoga@gmail.com');
        await page.fill('input[id="password"]', 'admin@123');

        // Click the "Log In" button inside the modal
        const loginButton = await page.locator('button:has-text("Log In")');
        await loginButton.click();

        // Wait for the login success (e.g., a redirect or a toast message)
        // We check for the role to decide the correct URL to verify after login
        const role = 'admin';  // Hardcoding role here for now (can be dynamic based on test data)
        const expectedURL = role === 'admin' ? 'http://localhost:5173/admin/home' : '/';

        // Verify the correct URL after login based on the user's role
        await expect(page).toHaveURL(expectedURL);  // Verify the URL changes according to role
    });

    test('should successfully log in with valid credentials for student', async ({ page }) => {
        // Click the login button to open the login modal
        await page.click('button:has-text("Login")');

        // Fill in the email and password fields
        await page.fill('input[id="login-email"]', 'asis.mool@gmail.com');
        await page.fill('input[id="password"]', 'test@123');

        // Click the "Log In" button inside the modal
        const loginButton = await page.locator('button:has-text("Log In")');
        await loginButton.click();

        // Wait for the login success (e.g., a redirect or a toast message)
        // We check for the role to decide the correct URL to verify after login
        const role = 'student';  // Hardcoding role here for now (can be dynamic based on test data)
        const expectedURL = role === 'student' ? 'http://localhost:5173/' : '/';

        // Verify the correct URL after login based on the user's role
        await expect(page).toHaveURL(expectedURL);  // Verify the URL changes according to role
    });

    test('should show an error message when logging in with invalid credentials', async ({ page }) => {
        // Click the login button to open the login modal
        await page.click('button:has-text("Login")');

        // Fill in invalid credentials
        await page.fill('input[id="login-email"]', 'invalid@example.com');
        await page.fill('input[id="password"]', 'wrongpassword');

        // Click the "Log In" button inside the modal
        const loginButton = await page.locator('button:has-text("Log In")');
        await loginButton.click();

        // Wait for the error message triggered by toast
        const errorMessage = 'Invalid email or password';
        await expect(page.locator(`text=${errorMessage}`)).toBeVisible();  // Verify that the toast displays the correct error message
    });


});