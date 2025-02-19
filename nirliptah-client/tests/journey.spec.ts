import { test, expect } from '@playwright/test';

test.describe('Journey Component', () => {

    test.beforeEach(async ({ page }) => {
        // Mock API responses
        await page.route('http://localhost:5000/api/users/user-count', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({ studentCount: 100 }),
            });
        });

        await page.route('http://localhost:5000/api/workshops', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([
                    { id: 1, title: 'Yoga for Beginners' },
                    { id: 2, title: 'Advanced Yoga' },
                ]),
            });
        });

        await page.route('http://localhost:5000/api/workshop-categories', route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify([
                    { id: 1, name: 'Yoga' },
                    { id: 2, name: 'Meditation' },
                ]),
            });
        });

        // Navigate to the page where the Journey component is rendered
        await page.goto('http://localhost:5173'); // Homepage URL
    });

    test('should not show sign-up button when email and role are present', async ({ page }) => {
        // Mock the presence of email and role in the AuthContext
        await page.evaluate(() => {
            window.localStorage.setItem('auth', JSON.stringify({ email: 'test@example.com', role: 'user' }));
        });

        // Reload the page after setting the mock context
        await page.reload();

        // Check if the Sign-Up button is NOT visible
        await expect(page.locator('text=Sign Up')).toBeHidden();
    });


});
