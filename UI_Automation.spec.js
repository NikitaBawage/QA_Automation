// ===============================
// UI Automation with Playwright
// ===============================
// Install dependencies before running:
// npm install -D @playwright/test

const { test, expect } = require('@playwright/test');

// Setup and Teardown Methods
test.beforeEach(async ({ page }) => {
    console.log("Setting up test environment...");
    await page.goto('https://www.saucedemo.com/');
});

test.afterEach(async ({ page }) => {
    console.log("Cleaning up test environment...");
    await page.close();
});

// Login Page Object
class LoginPage {
    constructor(page) {
        this.page = page;
    }

    async login(username, password) {
        try {
            await this.page.fill('#user-name', username);
            await this.page.fill('#password', password);
            await this.page.click('#login-button');
        } catch (error) {
            console.error("Error during login:", error);
        }
    }
}

// Products Page Object
class ProductsPage {
    constructor(page) {
        this.page = page;
    }

    async getProductDetails() {
        try {
            const name = await this.page.textContent('.inventory_item_name');
            const price = await this.page.textContent('.inventory_item_price');
            console.log(`Product Selected: ${name} - ${price}`);
            return { name, price };
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    async addToCart() {
        try {
            await this.page.click('.btn_inventory');
        } catch (error) {
            console.error("Error adding product to cart:", error);
        }
    }

    async goToCart() {
        try {
            await this.page.click('.shopping_cart_link');
        } catch (error) {
            console.error("Error navigating to cart:", error);
        }
    }
}

// Cart Page Object
class CartPage {
    constructor(page) {
        this.page = page;
    }

    async verifyProductInCart(expectedProduct) {
        try {
            const cartProduct = await this.page.textContent('.inventory_item_name');
            expect(cartProduct).toBe(expectedProduct);
        } catch (error) {
            console.error("Error verifying product in cart:", error);
        }
    }

    async logout() {
        try {
            await this.page.click('#react-burger-menu-btn');
            await this.page.click('#logout_sidebar_link');
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
}

// Test case: Verify login functionality
test('Login Test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.login('standard_user', 'secret_sauce');
    await expect(page).toHaveURL(/.*inventory.html/);
});

// Test case: Add a product to the cart and verify
test('Add to Cart Test', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);

    await loginPage.login('standard_user', 'secret_sauce');
    const product = await productsPage.getProductDetails();
    await productsPage.addToCart();
    await productsPage.goToCart();
    await cartPage.verifyProductInCart(product.name);
    await cartPage.logout();
});
