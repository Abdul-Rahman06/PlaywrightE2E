import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

test.describe('SauceDemo Performance Glitch User', () => {
  test('should login as performance glitch user and load inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.performance.username, testUsers.performance.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    expect(await inventoryPage.getInventoryItemsCount()).toBeGreaterThan(0);
  });
}); 