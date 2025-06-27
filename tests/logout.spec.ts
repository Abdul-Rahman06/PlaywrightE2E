import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';


test.describe('SauceDemo Logout', () => {
  test('should logout and redirect to login page', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.logout();
    // After logout, should be redirected to login page
    await expect(page).toHaveURL(/.*saucedemo.com\//);
    expect(await page.locator('#login-button').isVisible()).toBeTruthy();
  });
}); 