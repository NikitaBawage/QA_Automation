const { test, expect } = require('@playwright/test');
const axios = require('axios');

test('API Test', async () => {
    try {
        const response = await axios.get('https://reqres.in/');
        expect(response.status).toBe(200);
    } catch (error) {
        console.error("API Test Failed:", error);
    }
});
