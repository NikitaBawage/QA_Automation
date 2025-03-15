// Install dependencies: playwright
// npm init -y
// npm install @playwright/test fs

const { test, expect } = require('@playwright/test');
const fs = require('fs');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('#user-name');
    this.password = page.locator('#password');
    this.loginButton = page.locator('#login-button');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
}

class ProductsPage {
  constructor(page) {
    this.page = page;
    this.productName = page.locator('.inventory_item_name').first();
    this.productPrice = page.locator('.inventory_item_price').first();
    this.addToCartButton = page.locator('.btn_inventory').first();
    this.cartIcon = page.locator('.shopping_cart_link');
  }

  async getProductDetails() {
    const name = await this.productName.innerText();
    const price = await this.productPrice.innerText();
    fs.writeFileSync('productDetails.txt', `${name} - ${price}`);
    return { name, price };
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}

class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item');
    this.logoutMenu = page.locator('#react-burger-menu-btn');
    this.logoutButton = page.locator('#logout_sidebar_link');
  }

  async verifyProductInCart(productName) {
    const cartItemName = await this.cartItem.locator('.inventory_item_name').innerText();
    expect(cartItemName).toBe(productName);
  }

  async logout() {
    await this.logoutMenu.click();
    await this.logoutButton.click();
  }
}

test('UI Automation - Add to Cart', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');

  const loginPage = new LoginPage(page);
  await loginPage.login('standard_user', 'secret_sauce');
  expect(page.url()).toContain('inventory.html');

  const productsPage = new ProductsPage(page);
  const { name, price } = await productsPage.getProductDetails();
  await productsPage.addToCart();
  await productsPage.goToCart();

  const cartPage = new CartPage(page);
  await cartPage.verifyProductInCart(name);
  await cartPage.logout();
});

// API Automation
const axios = require('axios');

test('API Automation - Validate GET Response', async () => {
  const response = await axios.get('https://reqres.in/api/users/2');
  expect(response.status).toBe(200);
});
