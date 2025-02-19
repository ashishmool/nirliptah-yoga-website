import { test, expect } from '@playwright/test';

test.describe('Homepage API Tests', () => {

    test('should load the homepage', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await expect(page).toHaveTitle(/Nirlipta Yoga/);
    });

    test('should display at least one workshop title', async ({ page }) => {
        await page.goto('http://localhost:5173');

        // Wait for the first workshop card title
        await page.waitForSelector('.workshop-card h3');

        // Check if the workshop title exists
        const workshopTitle = await page.locator('.workshop-card').first();
        await expect(workshopTitle).not.toBeEmpty();
    });
});
