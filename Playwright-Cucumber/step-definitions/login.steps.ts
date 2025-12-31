import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { LoginPage } from "../../src/pages/login-page";
import { testUsers } from "../../src/data/test-users";
import{InventoryPage} from "../../src/pages/inventory-page"
import { appConfig } from "../../src/data/global-config";


Given("I login with standard user", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login(
    testUsers.standard.username,
    testUsers.standard.password
  );
});

Then("Inventory page should be loaded", async function () {
    await expect(this.page).toHaveURL(/.*\/inventory/);
});

Given("I login with locked out user", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login(
    testUsers.locked.username,
    testUsers.locked.password
  );
});

Then("error should be shown", async function () {
  const loginPage = new LoginPage(this.page);
  expect(await loginPage.getErrorMessage()).toContain('locked out');
});

Given("I login with invalid credentials", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login('invalid_user', 'invalid_pass');
});

Then("error should be shown for invalid credentials", async function () {
  const loginPage = new LoginPage(this.page);
  expect(await loginPage.getErrorMessage()).toContain('Username and password do not match');
});

Given("I try to login with missing username", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login('', 'invalid_pass');
});

Then("error should be shown for missing username", async function () {
  const loginPage = new LoginPage(this.page);
  expect(await loginPage.getErrorMessage()).toContain('Username is required');
});

Given("I try to login with missing password", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login(testUsers.standard.username, '')
})
Then("error should be shown for missing password", async function () {
  const loginPage = new LoginPage(this.page);
  expect(await loginPage.getErrorMessage()).toContain('Password is required');;
})

Given("I logged in with standard user", async function () {
  const loginPage = new LoginPage(this.page);
  await loginPage.goto(appConfig.baseURL);
  await loginPage.login(testUsers.standard.username, testUsers.standard.password)
})

When("I log out", async function(){
  const inventoryPage = new InventoryPage(this.page);
  await inventoryPage.logout();
})
Then("user should be logged out", async function() {
  await expect(this.page).toHaveURL(appConfig.baseURL);
})
Then("the login page is shown", async function() {
  const loginPage = new LoginPage(this.page);
 expect(await this.page.locator(loginPage.loginButton).isVisible());
})
