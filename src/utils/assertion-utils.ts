import { Page, expect } from '@playwright/test';
import { Logger } from './logger';

/**
 * Assertion utility functions for test automation
 * Provides common assertion methods with detailed logging
 */
export class AssertionUtils {
  private page: Page;
  private logger: Logger;

  constructor(page: Page) {
    this.page = page;
    this.logger = new Logger('AssertionUtils');
  }

  /**
   * Assert element is visible
   */
  async assertElementVisible(selector: string, message?: string): Promise<void> {
    const expected = true;
    const actual = await this.page.locator(selector).isVisible();
    const assertionMessage = message || `Element ${selector} should be visible`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element is not visible
   */
  async assertElementNotVisible(selector: string, message?: string): Promise<void> {
    const expected = false;
    const actual = await this.page.locator(selector).isVisible();
    const assertionMessage = message || `Element ${selector} should not be visible`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element text equals expected value
   */
  async assertTextEquals(selector: string, expectedText: string, message?: string): Promise<void> {
    const actualText = await this.page.locator(selector).textContent() || '';
    const assertionMessage = message || `Element ${selector} text should equal "${expectedText}"`;
    
    this.logger.logAssertion(assertionMessage, expectedText, actualText, expectedText === actualText);
    expect(actualText, assertionMessage).toBe(expectedText);
  }

  /**
   * Assert element text contains expected value
   */
  async assertTextContains(selector: string, expectedText: string, message?: string): Promise<void> {
    const actualText = await this.page.locator(selector).textContent() || '';
    const assertionMessage = message || `Element ${selector} text should contain "${expectedText}"`;
    
    this.logger.logAssertion(assertionMessage, expectedText, actualText, actualText.includes(expectedText));
    expect(actualText, assertionMessage).toContain(expectedText);
  }

  /**
   * Assert element attribute equals expected value
   */
  async assertAttributeEquals(selector: string, attribute: string, expectedValue: string, message?: string): Promise<void> {
    const actualValue = await this.page.locator(selector).getAttribute(attribute) || '';
    const assertionMessage = message || `Element ${selector} ${attribute} should equal "${expectedValue}"`;
    
    this.logger.logAssertion(assertionMessage, expectedValue, actualValue, expectedValue === actualValue);
    expect(actualValue, assertionMessage).toBe(expectedValue);
  }

  /**
   * Assert element attribute contains expected value
   */
  async assertAttributeContains(selector: string, attribute: string, expectedValue: string, message?: string): Promise<void> {
    const actualValue = await this.page.locator(selector).getAttribute(attribute) || '';
    const assertionMessage = message || `Element ${selector} ${attribute} should contain "${expectedValue}"`;
    
    this.logger.logAssertion(assertionMessage, expectedValue, actualValue, actualValue.includes(expectedValue));
    expect(actualValue, assertionMessage).toContain(expectedValue);
  }

  /**
   * Assert element is enabled
   */
  async assertElementEnabled(selector: string, message?: string): Promise<void> {
    const expected = true;
    const actual = await this.page.locator(selector).isEnabled();
    const assertionMessage = message || `Element ${selector} should be enabled`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element is disabled
   */
  async assertElementDisabled(selector: string, message?: string): Promise<void> {
    const expected = false;
    const actual = await this.page.locator(selector).isEnabled();
    const assertionMessage = message || `Element ${selector} should be disabled`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element is checked (for checkboxes/radio buttons)
   */
  async assertElementChecked(selector: string, message?: string): Promise<void> {
    const expected = true;
    const actual = await this.page.locator(selector).isChecked();
    const assertionMessage = message || `Element ${selector} should be checked`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element is not checked
   */
  async assertElementNotChecked(selector: string, message?: string): Promise<void> {
    const expected = false;
    const actual = await this.page.locator(selector).isChecked();
    const assertionMessage = message || `Element ${selector} should not be checked`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert page title equals expected value
   */
  async assertPageTitle(title: string, message?: string): Promise<void> {
    const actualTitle = await this.page.title();
    const assertionMessage = message || `Page title should be "${title}"`;
    
    this.logger.logAssertion(assertionMessage, title, actualTitle, title === actualTitle);
    expect(actualTitle, assertionMessage).toBe(title);
  }

  /**
   * Assert page title contains expected value
   */
  async assertPageTitleContains(title: string, message?: string): Promise<void> {
    const actualTitle = await this.page.title();
    const assertionMessage = message || `Page title should contain "${title}"`;
    
    this.logger.logAssertion(assertionMessage, title, actualTitle, actualTitle.includes(title));
    expect(actualTitle, assertionMessage).toContain(title);
  }

  /**
   * Assert current URL equals expected value
   */
  async assertCurrentUrl(url: string, message?: string): Promise<void> {
    const actualUrl = this.page.url();
    const assertionMessage = message || `Current URL should be "${url}"`;
    
    this.logger.logAssertion(assertionMessage, url, actualUrl, url === actualUrl);
    expect(actualUrl, assertionMessage).toBe(url);
  }

  /**
   * Assert current URL contains expected value
   */
  async assertCurrentUrlContains(url: string, message?: string): Promise<void> {
    const actualUrl = this.page.url();
    const assertionMessage = message || `Current URL should contain "${url}"`;
    
    this.logger.logAssertion(assertionMessage, url, actualUrl, actualUrl.includes(url));
    expect(actualUrl, assertionMessage).toContain(url);
  }

  /**
   * Assert element count equals expected value
   */
  async assertElementCount(selector: string, expectedCount: number, message?: string): Promise<void> {
    const actualCount = await this.page.locator(selector).count();
    const assertionMessage = message || `Element count for ${selector} should be ${expectedCount}`;
    
    this.logger.logAssertion(assertionMessage, expectedCount, actualCount, expectedCount === actualCount);
    expect(actualCount, assertionMessage).toBe(expectedCount);
  }

  /**
   * Assert element count is greater than expected value
   */
  async assertElementCountGreaterThan(selector: string, expectedCount: number, message?: string): Promise<void> {
    const actualCount = await this.page.locator(selector).count();
    const assertionMessage = message || `Element count for ${selector} should be greater than ${expectedCount}`;
    
    this.logger.logAssertion(assertionMessage, `> ${expectedCount}`, actualCount, actualCount > expectedCount);
    expect(actualCount, assertionMessage).toBeGreaterThan(expectedCount);
  }

  /**
   * Assert element count is less than expected value
   */
  async assertElementCountLessThan(selector: string, expectedCount: number, message?: string): Promise<void> {
    const actualCount = await this.page.locator(selector).count();
    const assertionMessage = message || `Element count for ${selector} should be less than ${expectedCount}`;
    
    this.logger.logAssertion(assertionMessage, `< ${expectedCount}`, actualCount, actualCount < expectedCount);
    expect(actualCount, assertionMessage).toBeLessThan(expectedCount);
  }

  /**
   * Assert value equals expected value
   */
  async assertValueEquals(selector: string, expectedValue: string, message?: string): Promise<void> {
    const actualValue = await this.page.locator(selector).inputValue();
    const assertionMessage = message || `Element ${selector} value should equal "${expectedValue}"`;
    
    this.logger.logAssertion(assertionMessage, expectedValue, actualValue, expectedValue === actualValue);
    expect(actualValue, assertionMessage).toBe(expectedValue);
  }

  /**
   * Assert value contains expected value
   */
  async assertValueContains(selector: string, expectedValue: string, message?: string): Promise<void> {
    const actualValue = await this.page.locator(selector).inputValue();
    const assertionMessage = message || `Element ${selector} value should contain "${expectedValue}"`;
    
    this.logger.logAssertion(assertionMessage, expectedValue, actualValue, actualValue.includes(expectedValue));
    expect(actualValue, assertionMessage).toContain(expectedValue);
  }

  /**
   * Assert number equals expected value
   */
  async assertNumberEquals(actual: number, expected: number, message?: string): Promise<void> {
    const assertionMessage = message || `Number should equal ${expected}`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert number is greater than expected value
   */
  async assertNumberGreaterThan(actual: number, expected: number, message?: string): Promise<void> {
    const assertionMessage = message || `Number should be greater than ${expected}`;
    
    this.logger.logAssertion(assertionMessage, `> ${expected}`, actual, actual > expected);
    expect(actual, assertionMessage).toBeGreaterThan(expected);
  }

  /**
   * Assert number is less than expected value
   */
  async assertNumberLessThan(actual: number, expected: number, message?: string): Promise<void> {
    const assertionMessage = message || `Number should be less than ${expected}`;
    
    this.logger.logAssertion(assertionMessage, `< ${expected}`, actual, actual < expected);
    expect(actual, assertionMessage).toBeLessThan(expected);
  }

  /**
   * Assert boolean is true
   */
  async assertTrue(condition: boolean, message?: string): Promise<void> {
    const expected = true;
    const assertionMessage = message || 'Condition should be true';
    
    this.logger.logAssertion(assertionMessage, expected, condition, condition === expected);
    expect(condition, assertionMessage).toBe(expected);
  }

  /**
   * Assert boolean is false
   */
  async assertFalse(condition: boolean, message?: string): Promise<void> {
    const expected = false;
    const assertionMessage = message || 'Condition should be false';
    
    this.logger.logAssertion(assertionMessage, expected, condition, condition === expected);
    expect(condition, assertionMessage).toBe(expected);
  }

  /**
   * Assert arrays are equal
   */
  async assertArraysEqual(actual: any[], expected: any[], message?: string): Promise<void> {
    const assertionMessage = message || 'Arrays should be equal';
    const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
    
    this.logger.logAssertion(assertionMessage, expected, actual, isEqual);
    expect(actual, assertionMessage).toEqual(expected);
  }

  /**
   * Assert objects are equal
   */
  async assertObjectsEqual(actual: any, expected: any, message?: string): Promise<void> {
    const assertionMessage = message || 'Objects should be equal';
    const isEqual = JSON.stringify(actual) === JSON.stringify(expected);
    
    this.logger.logAssertion(assertionMessage, expected, actual, isEqual);
    expect(actual, assertionMessage).toEqual(expected);
  }

  /**
   * Assert element exists in DOM
   */
  async assertElementExists(selector: string, message?: string): Promise<void> {
    const expected = true;
    const actual = await this.page.locator(selector).count() > 0;
    const assertionMessage = message || `Element ${selector} should exist`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element does not exist in DOM
   */
  async assertElementNotExists(selector: string, message?: string): Promise<void> {
    const expected = false;
    const actual = await this.page.locator(selector).count() > 0;
    const assertionMessage = message || `Element ${selector} should not exist`;
    
    this.logger.logAssertion(assertionMessage, expected, actual, expected === actual);
    expect(actual, assertionMessage).toBe(expected);
  }

  /**
   * Assert element has CSS class
   */
  async assertHasClass(selector: string, className: string, message?: string): Promise<void> {
    const actualClasses = await this.page.locator(selector).getAttribute('class') || '';
    const hasClass = actualClasses.includes(className);
    const assertionMessage = message || `Element ${selector} should have class "${className}"`;
    
    this.logger.logAssertion(assertionMessage, className, actualClasses, hasClass);
    expect(hasClass, assertionMessage).toBe(true);
  }

  /**
   * Assert element does not have CSS class
   */
  async assertNotHasClass(selector: string, className: string, message?: string): Promise<void> {
    const actualClasses = await this.page.locator(selector).getAttribute('class') || '';
    const hasClass = actualClasses.includes(className);
    const assertionMessage = message || `Element ${selector} should not have class "${className}"`;
    
    this.logger.logAssertion(assertionMessage, `not ${className}`, actualClasses, !hasClass);
    expect(hasClass, assertionMessage).toBe(false);
  }
} 