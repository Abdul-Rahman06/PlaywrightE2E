import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

test.describe('SauceDemo Problem User', () => {
  test('should login as problem user and load inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.problem.username, testUsers.problem.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    expect(await inventoryPage.getInventoryItemsCount()).toBeGreaterThan(0);
  });

  test('should show error for invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.problem.username, 'wrong_password');
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });
}); 