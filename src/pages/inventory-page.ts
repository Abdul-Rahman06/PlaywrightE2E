import { expect, Page } from "@playwright/test";
import { CommonUtils } from "../utils/common-utils";
import { TestDataGenerator } from "../utils/test-data-generator";

export class InventoryPage {
  private page: Page;
  public utils: CommonUtils;
  private dataGen: TestDataGenerator;

  // Locators
  private inventoryContainer = ".inventory_list";
  private inventoryItem = ".inventory_item";
  private inventoryPrice = ".inventory_item_price";
  private inventoryItemName = ".inventory_item_name ";
  private burgerMenu = "#react-burger-menu-btn";
  private logoutLink = "#logout_sidebar_link";
  private addToCartButton = (itemName: string) =>
    `button[data-test="add-to-cart-${itemName}"]`;
  private removeFromCartButton = (itemName: string) =>
    `button[data-test="remove-${itemName}"]`;
  private cartBadge = ".shopping_cart_badge";
  private cartLink = ".shopping_cart_link";
  private sortButton = ".product_sort_container";

  public checkout = "#checkout";
  public FirstName = "#first-name";
  public lastName = "#last-name";
  public zipCode = "#postal-code";
  public continue = "#continue";
  private finishOrder = "#finish";
  private CompleteOrder = ".complete-header";

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);
    this.dataGen = new TestDataGenerator();
  }

  async goToInventory() {
    await this.page.goto('/inventory.html', { waitUntil: 'domcontentloaded' });
  }

  async isLoaded(): Promise<boolean> {
    return this.utils.isElementVisible(this.inventoryContainer);
  }

  async getInventoryItemsCount(): Promise<number> {
    const items = await this.page.locator(this.inventoryItem);
    return await items.count();
  }

  async logout() {
    await this.utils.clickElement(this.burgerMenu);
    await this.utils.clickElement(this.logoutLink);
  }

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
  async gotoCheckout() {
    await this.utils.clickElement(this.checkout);
  }
  async fillForm() {
    const userData = await this.dataGen.generateUserData();
    await this.utils.fillInput(this.FirstName, userData.firstName);
    await this.utils.fillInput(this.lastName, userData.firstName);
    await this.utils.fillInput(this.zipCode, userData.zipCode);
    await this.utils.clickElement(this.continue);
  }

  async finisOrder() {
    await this.utils.clickElement(this.finishOrder);
  }
  async SuccessOrder() {
    const message = this.utils.getText(this.CompleteOrder);
    return message;
  }
  async sortPageAsc() {
    const beforeSort = await this.page
      .locator(this.inventoryItem)
      .allTextContents();
    await this.utils.selectOption(this.sortButton, "Name (A to Z)");

    const afterSort = await this.page
      .locator(this.inventoryItem)
      .allTextContents();

    const expected = [...beforeSort].sort((a, b) => a.localeCompare(b));
    expect(afterSort).toEqual(expected);
  }
  async sortPageDesc() {
    const beforeSort = await this.page
      .locator(this.inventoryItem)
      .allTextContents();
    await this.utils.selectOption(this.sortButton, "Name (Z to A)");

    const afterSort = await this.page
      .locator(this.inventoryItem)
      .allTextContents();

    const expected = [...beforeSort].sort((a, b) => b.localeCompare(a));
    expect(afterSort).toEqual(expected);
  }
  async sortPageHightoLow() {
    const beforeSort = await this.page
      .locator(this.inventoryPrice)
      .allTextContents();

    await this.utils.selectOption(this.sortButton, "Price (high to low)");

    const afterSort = await this.page
      .locator(this.inventoryPrice)
      .allTextContents();

    const expected = [...beforeSort]
      .map((p) => Number(p.replace("$", "")))
      .sort((a, b) => b - a);

    const actual = afterSort.map((p) => Number(p.replace("$", "")));

    expect(actual).toEqual(expected);
  }
  async sortPageLowtoHigh() {
    const beforeSort = await this.page
      .locator(this.inventoryPrice)
      .allTextContents();

    await this.utils.selectOption(this.sortButton, "Price (low to high)");

    const afterSort = await this.page
      .locator(this.inventoryPrice)
      .allTextContents();

    const expected = [...beforeSort]
      .map((p) => Number(p.replace("$", "")))
      .sort((a, b) => a - b);

    const actual = afterSort.map((p) => Number(p.replace("$", "")));

    expect(actual).toEqual(expected);
  }
  // async getSortingResult() {
  //   const itemName = await this.page.locator(this.inventoryItem).allTextContents()
  //   const sorted = [itemName].sort().reverse();
  //   expect(itemName).toEqual(sorted)
  // }
}
