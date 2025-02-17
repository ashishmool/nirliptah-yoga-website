// import { test, expect } from '@playwright/test';
//
// const mockData = [
//   {
//     "_id": "678cc19f6da48f186152f5f6",
//     "title": "Morning Asanas for Flexibility",
//     "price": 80,
//     "discount_price": 78,
//     "photo": "/uploads/workshop_photos/workshop_photo-1737277855654-111200178.jpeg",
//   },
//   {
//     "_id": "678cc2666da48f186152f61e",
//     "title": "Kids Yoga Fun Session",
//     "price": 55,
//     "photo": "/uploads/workshop_photos/workshop_photo-1737277855654-111200178.jpeg",
//   },
// ];
//
// test('should fetch and display workshop API data', async ({ page }) => {
//   // Mock the API response
//   await page.route('http://localhost:5000/api/workshops', async (route) => {
//     await route.fulfill({
//       status: 200,
//       contentType: 'application/json',
//       body: JSON.stringify(mockData),
//     });
//   });
//
//   // Navigate to the workshops page
//   await page.goto('http://localhost:5173/admin/workshops');
//
//   // Wait for at least one table row to appear
//   await page.waitForSelector('table tbody tr', { timeout: 30000 });
//
//   // Verify if the workshop titles are displayed in the table
//   for (const item of mockData) {
//     await expect(page.locator('tbody')).toContainText(item.title);
//   }
// });
