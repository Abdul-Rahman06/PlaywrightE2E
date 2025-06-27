import { Page, Locator, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * Common utility functions for test automation
 * Provides reusable methods for common operations
 */
export class CommonUtils {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('CommonUtils');
  }

  /**
   * Wait for element to be visible and clickable
   */
  async waitForElement(selector: string, timeout: number = 10000): Promise<Locator> {
    this.logger.logElementInteraction('waitForElement', selector);
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'visible', timeout });
    return element;
  }

  /**
   * Click element with retry mechanism
   */
  async clickElement(selector: string, retries: number = 3): Promise<void> {
    this.logger.logElementInteraction('clickElement', selector);
    
    for (let i = 0; i < retries; i++) {
      try {
        const element = await this.waitForElement(selector);
        await element.click();
        return;
      } catch (error) {
        if (i === retries - 1) throw error;
        this.logger.warn(`Click attempt ${i + 1} failed, retrying...`, { selector, error });
        await this.page.waitForTimeout(1000);
      }
    }
  }

  /**
   * Fill input field with value
   */
  async fillInput(selector: string, value: string): Promise<void> {
    this.logger.logElementInteraction('fillInput', selector, value);
    const element = await this.waitForElement(selector);
    await element.fill(value);
  }

  /**
   * Type text with delay (for human-like typing)
   */
  async typeText(selector: string, text: string, delay: number = 100): Promise<void> {
    this.logger.logElementInteraction('typeText', selector, text);
    const element = await this.waitForElement(selector);
    await element.type(text, { delay });
  }

  /**
   * Select option from dropdown
   */
  async selectOption(selector: string, value: string): Promise<void> {
    this.logger.logElementInteraction('selectOption', selector, value);
    const element = await this.waitForElement(selector);
    await element.selectOption(value);
  }

  /**
   * Check or uncheck checkbox
   */
  async setCheckbox(selector: string, checked: boolean): Promise<void> {
    this.logger.logElementInteraction('setCheckbox', selector, checked.toString());
    const element = await this.waitForElement(selector);
    if (checked) {
      await element.check();
    } else {
      await element.uncheck();
    }
  }

  /**
   * Get text content of element
   */
  async getText(selector: string): Promise<string> {
    this.logger.logElementInteraction('getText', selector);
    const element = await this.waitForElement(selector);
    return await element.textContent() || '';
  }

  /**
   * Get attribute value of element
   */
  async getAttribute(selector: string, attribute: string): Promise<string | null> {
    this.logger.logElementInteraction('getAttribute', selector, attribute);
    const element = await this.waitForElement(selector);
    return await element.getAttribute(attribute);
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    this.logger.logElementInteraction('isElementVisible', selector);
    const element = this.page.locator(selector);
    return await element.isVisible();
  }

  /**
   * Check if element exists in DOM
   */
  async isElementPresent(selector: string): Promise<boolean> {
    this.logger.logElementInteraction('isElementPresent', selector);
    const element = this.page.locator(selector);
    return await element.count() > 0;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(): Promise<void> {
    this.logger.logStep('Waiting for page to load');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific URL
   */
  async waitForUrl(url: string, timeout: number = 10000): Promise<void> {
    this.logger.logStep(`Waiting for URL: ${url}`);
    await this.page.waitForURL(url, { timeout });
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    this.logger.logStep(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }

  /**
   * Scroll to element
   */
  async scrollToElement(selector: string): Promise<void> {
    this.logger.logElementInteraction('scrollToElement', selector);
    const element = await this.waitForElement(selector);
    await element.scrollIntoViewIfNeeded();
  }

  /**
   * Hover over element
   */
  async hoverOverElement(selector: string): Promise<void> {
    this.logger.logElementInteraction('hoverOverElement', selector);
    const element = await this.waitForElement(selector);
    await element.hover();
  }

  /**
   * Right click on element
   */
  async rightClickElement(selector: string): Promise<void> {
    this.logger.logElementInteraction('rightClickElement', selector);
    const element = await this.waitForElement(selector);
    await element.click({ button: 'right' });
  }

  /**
   * Double click on element
   */
  async doubleClickElement(selector: string): Promise<void> {
    this.logger.logElementInteraction('doubleClickElement', selector);
    const element = await this.waitForElement(selector);
    await element.dblclick();
  }

  /**
   * Clear input field
   */
  async clearInput(selector: string): Promise<void> {
    this.logger.logElementInteraction('clearInput', selector);
    const element = await this.waitForElement(selector);
    await element.clear();
  }

  /**
   * Wait for element to disappear
   */
  async waitForElementToDisappear(selector: string, timeout: number = 10000): Promise<void> {
    this.logger.logElementInteraction('waitForElementToDisappear', selector);
    const element = this.page.locator(selector);
    await element.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Wait for element count to match
   */
  async waitForElementCount(selector: string, count: number, timeout: number = 10000): Promise<void> {
    this.logger.logElementInteraction('waitForElementCount', selector, count.toString());
    await this.page.waitForFunction(
      (selector, expectedCount) => {
        return document.querySelectorAll(selector).length === expectedCount;
      },
      selector,
      count,
      { timeout }
    );
  }

  /**
   * Wait for text to be present in element
   */
  async waitForText(selector: string, text: string, timeout: number = 10000): Promise<void> {
    this.logger.logElementInteraction('waitForText', selector, text);
    const element = await this.waitForElement(selector);
    await element.waitFor({ hasText: text, timeout });
  }

  /**
   * Get all elements matching selector
   */
  async getAllElements(selector: string): Promise<Locator[]> {
    this.logger.logElementInteraction('getAllElements', selector);
    const elements = this.page.locator(selector);
    const count = await elements.count();
    return Array.from({ length: count }, (_, i) => elements.nth(i));
  }

  /**
   * Get element by index
   */
  async getElementByIndex(selector: string, index: number): Promise<Locator> {
    this.logger.logElementInteraction('getElementByIndex', selector, index.toString());
    return this.page.locator(selector).nth(index);
  }

  /**
   * Wait for network request to complete
   */
  async waitForNetworkIdle(): Promise<void> {
    this.logger.logStep('Waiting for network to be idle');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific network request
   */
  async waitForRequest(urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
    this.logger.logStep(`Waiting for request: ${urlPattern}`);
    await this.page.waitForRequest(urlPattern, { timeout });
  }

  /**
   * Wait for specific network response
   */
  async waitForResponse(urlPattern: string | RegExp, timeout: number = 10000): Promise<void> {
    this.logger.logStep(`Waiting for response: ${urlPattern}`);
    await this.page.waitForResponse(urlPattern, { timeout });
  }

  /**
   * Execute JavaScript in page context
   */
  async executeScript(script: string): Promise<any> {
    this.logger.logStep(`Executing script: ${script.substring(0, 50)}...`);
    return await this.page.evaluate(script);
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Get current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Navigate to URL
   */
  async navigateTo(url: string): Promise<void> {
    this.logger.logStep(`Navigating to: ${url}`);
    await this.page.goto(url);
    await this.waitForPageLoad();
  }

  /**
   * Go back in browser history
   */
  async goBack(): Promise<void> {
    this.logger.logStep('Going back in browser history');
    await this.page.goBack();
    await this.waitForPageLoad();
  }

  /**
   * Go forward in browser history
   */
  async goForward(): Promise<void> {
    this.logger.logStep('Going forward in browser history');
    await this.page.goForward();
    await this.waitForPageLoad();
  }

  /**
   * Refresh page
   */
  async refreshPage(): Promise<void> {
    this.logger.logStep('Refreshing page');
    await this.page.reload();
    await this.waitForPageLoad();
  }

  /**
   * Accept alert/dialog
   */
  async acceptAlert(): Promise<void> {
    this.logger.logStep('Accepting alert');
    this.page.on('dialog', dialog => dialog.accept());
  }

  /**
   * Dismiss alert/dialog
   */
  async dismissAlert(): Promise<void> {
    this.logger.logStep('Dismissing alert');
    this.page.on('dialog', dialog => dialog.dismiss());
  }

  /**
   * Get alert text
   */
  async getAlertText(): Promise<string> {
    return new Promise((resolve) => {
      this.page.on('dialog', dialog => {
        resolve(dialog.message());
        dialog.accept();
      });
    });
  }

  /**
   * Switch to frame
   */
  async switchToFrame(frameSelector: string): Promise<void> {
    this.logger.logStep(`Switching to frame: ${frameSelector}`);
    const frame = this.page.frameLocator(frameSelector);
    // Note: This is a simplified version. In actual implementation, you might need to handle this differently
  }

  /**
   * Switch to main content (out of frame)
   */
  async switchToMainContent(): Promise<void> {
    this.logger.logStep('Switching to main content');
    // Implementation depends on how you're handling frames
  }
} 