import { test, expect } from '@playwright/test';

test.describe('Homepage API Tests', () => {

    test('should load the homepage', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await expect(page).toHaveTitle(/Nirlipta Yoga/);
    });

    // test('should fetch and display workshops API data', async ({ page }) => {
    //     await page.route('http://localhost:5000/api/workshops', async (route) => {
    //         await route.continue();
    //     });
    //
    //     await page.goto('http://localhost:5173');
    //
    //     // Wait for API response and check if the workshops container exists
    //     await page.waitForSelector('.workshops-container');
    //     const workshops = await page.locator('.workshops-container');
    //     await expect(workshops).not.toBeEmpty();
    // });

    // test('should display workshop categories', async ({ page }) => {
    //     await page.goto('http://localhost:5173');
    //
    //     // Check for category buttons
    //     await expect(page.locator('text=Kids Yoga')).toBeVisible();
    //     await expect(page.locator('text=Asanas')).toBeVisible();
    //     await expect(page.locator('text=Weekend Yoga')).toBeVisible();
    // });

    test('should display at least one workshop title', async ({ page }) => {
        await page.goto('http://localhost:5173');

        // Wait for the first workshop card title
        await page.waitForSelector('.workshop-card h3');

        // Check if the workshop title exists
        const workshopTitle = await page.locator('.workshop-card').first();
        await expect(workshopTitle).not.toBeEmpty();
    });
});
