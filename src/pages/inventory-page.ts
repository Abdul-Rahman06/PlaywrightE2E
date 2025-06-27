import { Page } from '@playwright/test';
import { CommonUtils } from '../utils/common-utils';

export class InventoryPage {
  private page: Page;
  public  utils: CommonUtils;

  // Locators
  private inventoryContainer = '.inventory_list';
  private inventoryItem = '.inventory_item';
  private burgerMenu = '#react-burger-menu-btn';
  private logoutLink = '#logout_sidebar_link';

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);
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
} 