import {test, expect} from "@playwright/test";
import { LoginPage } from "@/pages/login-page";
import {testUsers} from "@/data/test-users";
test('authenticate user and save state', async({page}) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
    await expect(page).toHaveURL(/.*\/inventory/);
    await page.context().storageState({path: 'auth.json'});
});
