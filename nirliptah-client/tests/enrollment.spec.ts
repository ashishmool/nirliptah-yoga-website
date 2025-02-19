import { test, expect } from '@playwright/test';

test.describe('Enrollment API Tests', () => {
    test('should fetch enrollments', async ({ request }) => {
        const response = await request.get('http://localhost:5000/api/enrollments');
        expect(response.status()).toBe(200);

        const data = await response.json();
        expect(data.enrollments.length).toBeGreaterThan(0);
        expect(data.enrollments[0]).toHaveProperty('user_id');
        expect(data.enrollments[0]).toHaveProperty('workshop_id');
        expect(data.enrollments[0]).toHaveProperty('payment_status');
    });

});
