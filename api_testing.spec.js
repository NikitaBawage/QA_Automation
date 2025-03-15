const { test, expect } = require('@playwright/test');
const axios = require('axios');

test('API Test with Axios', async () => {
    const response = await axios.get('https://reqres.in/api/users/2');

    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('data');
    expect(response.data.data.id).toBe(2);

    console.log("Response Data:", response.data);
});
