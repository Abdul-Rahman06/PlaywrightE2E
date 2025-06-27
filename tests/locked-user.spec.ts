import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

test.describe('SauceDemo Locked Out User', () => {
  test('should show locked out error and not access inventory', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.locked.username, testUsers.locked.password);
    const errorMsg = await loginPage.getErrorMessage();
    expect(errorMsg).toContain('locked out');
    // Should not see inventory page
    expect(await page.locator('.inventory_list').isVisible()).toBeFalsy();
  });
}); 