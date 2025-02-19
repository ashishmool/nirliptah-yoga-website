import { test, expect } from '@playwright/test';

test.describe('Workshop API Tests', () => {

    test('should fetch workshops', async ({ request }) => {
        const response = await request.get('http://localhost:5000/api/workshops');
        expect(response.status()).toBe(200);

        const workshops = await response.json();
        expect(workshops.length).toBeGreaterThan(0);
        expect(workshops[0]).toHaveProperty('title');
        expect(workshops[0]).toHaveProperty('description');
        expect(workshops[0]).toHaveProperty('category');
    });

    test('should fetch categories', async ({ request }) => {
        const response = await request.get('http://localhost:5000/api/workshop-categories');
        expect(response.status()).toBe(200);

        const categories = await response.json();
        expect(categories.length).toBeGreaterThan(0);
        expect(categories[0]).toHaveProperty('name');
        expect(categories[0]).toHaveProperty('description');
    });

    test('should fetch enrollments', async ({ request }) => {
        const response = await request.get('http://localhost:5000/api/enrollments');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.enrollments.length).toBeGreaterThan(0);

        const firstEnrollment = data.enrollments[0];

        expect(firstEnrollment).toHaveProperty('workshop_id');
        expect(firstEnrollment).toHaveProperty('user_id');
        expect(firstEnrollment).toHaveProperty('enrollment_date');
    });

    test('should display workshops by category', async ({ page }) => {
        await page.goto('http://localhost:5173');

        // Wait for category buttons to load
        await page.waitForSelector('.categories-container button');

        // Log all available category names for debugging
        const availableCategories = await page.locator('.categories-container button').allTextContents();
        console.log('Available categories:', availableCategories);

        // Ensure the "Yoga Basics" category button exists
        const categoryButton = page.locator('.categories-container button', { hasText: 'Kids Yoga' });
        await expect(categoryButton).toBeVisible();

        // Click the "Yoga Basics" category button
        await categoryButton.click();

        // Wait for workshops to be filtered and displayed
        await page.waitForTimeout(1000); // Allow UI to update
        await page.waitForSelector('.workshop-card');

        // Check that workshops are displayed
        const workshopTitles = await page.locator('.workshop-card h3').allTextContents();
        console.log('Displayed workshops:', workshopTitles);
        expect(workshopTitles.length).toBeGreaterThan(0);

        // Verify that each displayed workshop is related to "Kids Yoga"
        for (const title of workshopTitles) {
            expect(title.toLowerCase()).toContain('kids yoga');
        }
    });

});