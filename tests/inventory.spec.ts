import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

test.describe('SauceDemo Inventory Actions', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto('/');
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
  });

  test('should add an item to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should remove an item from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('should add multiple items to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
  });

  test('cart badge disappears when all items are removed', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('should go to cart page after adding items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await expect(page).toHaveURL(/cart/);
  });

  test('should add and remove multiple items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await inventoryPage.removeItemFromCart('sauce-labs-bike-light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('should display correct number of inventory items', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    const count = await inventoryPage.getInventoryItemsCount();
    expect(count).toBeGreaterThan(0);
  });

  test('Should be able to sort in ascending order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortPageAsc();
    await inventoryPage.sortPageDesc();
    await inventoryPage.sortPageHightoLow();
    await inventoryPage.sortPageLowtoHigh();
  });

  test('Should be able to sort in descending order', async ({ page }) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.sortPageDesc();
  });

  test("Should be able to checkout the order", async  ({page}) => {
    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.goToCart();
    await inventoryPage.gotoCheckout();
    expect(page).toHaveURL('/checkout-step-one.html')
    await inventoryPage.fillForm();
    await inventoryPage.finisOrder();
    expect(await inventoryPage.SuccessOrder()).toContain('Thank you for your order!');
 
  })
}); 