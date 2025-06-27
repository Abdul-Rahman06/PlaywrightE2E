import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login-page';
import { InventoryPage } from '../src/pages/inventory-page';
import { testUsers } from '../src/data/test-users';

const BASE_URL = process.env.BASE_URL || 'https://www.saucedemo.com/';

// Extend InventoryPage for cart actions
class InventoryPageWithCart extends InventoryPage {
  private addToCartButton = (itemName: string) => `button[data-test="add-to-cart-${itemName}"]`;
  private removeFromCartButton = (itemName: string) => `button[data-test="remove-${itemName}"]`;
  private cartBadge = '.shopping_cart_badge';
  private cartLink = '.shopping_cart_link';

  async addItemToCart(itemName: string) {
    await this.utils.clickElement(this.addToCartButton(itemName));
  }

  async removeItemFromCart(itemName: string) {
    await this.utils.clickElement(this.removeFromCartButton(itemName));
  }

  async getCartBadgeCount(): Promise<number> {
    if (await this.utils.isElementVisible(this.cartBadge)) {
      const text = await this.utils.getText(this.cartBadge);
      return parseInt(text, 10);
    }
    return 0;
  }

  async goToCart() {
    await this.utils.clickElement(this.cartLink);
  }
}

test.describe('SauceDemo Inventory Actions', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(BASE_URL);
    await loginPage.login(testUsers.standard.username, testUsers.standard.password);
  });

  test('should add an item to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPageWithCart(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
  });

  test('should remove an item from the cart', async ({ page }) => {
    const inventoryPage = new InventoryPageWithCart(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(1);
    await inventoryPage.removeItemFromCart('sauce-labs-backpack');
    expect(await inventoryPage.getCartBadgeCount()).toBe(0);
  });

  test('should add multiple items to the cart', async ({ page }) => {
    const inventoryPage = new InventoryPageWithCart(page);
    await expect(await inventoryPage.isLoaded()).toBeTruthy();
    await inventoryPage.addItemToCart('sauce-labs-backpack');
    await inventoryPage.addItemToCart('sauce-labs-bike-light');
    expect(await inventoryPage.getCartBadgeCount()).toBe(2);
  });
}); 