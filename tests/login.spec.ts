import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

test.describe('SauceDemo Login E2E', () => {
  test('should login successfully with standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    expect(await inventoryPage.getInventoryItemsCount()).toBeGreaterThan(0);
  });

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.locked.username, testUsers.locked.password);
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });
}); 