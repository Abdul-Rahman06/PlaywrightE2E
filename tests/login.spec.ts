import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';


test.describe('SauceDemo Login E2E', () => {
  test('should login successfully with standard user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto('/');
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
  });

  test('should show error for locked out user', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login(testUsers.locked.username, testUsers.locked.password);
    expect(await loginPage.getErrorMessage()).toContain('locked out');
  });

  test('show error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login('invalid_user', 'invalid_pass');
    expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
  });

  test('should show error for empty username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login('', 'secret_sauce');
    expect(await loginPage.getErrorMessage()).toContain('Username is required');
  });

  test('should show error for empty password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login('standard_user', '');
    expect(await loginPage.getErrorMessage()).toContain('Password is required');
  });

  test('should logout after login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    await loginPage.goto('/');
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.logout();
    await expect(page).toHaveURL(/saucedemo.com\//);
    expect(await page.locator('#login-button').isVisible()).toBeTruthy();
  });
}); 