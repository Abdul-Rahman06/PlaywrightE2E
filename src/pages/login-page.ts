import { Page } from '@playwright/test';
import { CommonUtils } from '../utils/common-utils';

export class LoginPage {
  private page: Page;
  private utils: CommonUtils;

  // Locators
  private usernameInput = '#user-name';
  private passwordInput = '#password';
  private loginButton = '#login-button';
  private errorMessage = '[data-test="error"]';

  constructor(page: Page) {
    this.page = page;
    this.utils = new CommonUtils(page);
  }

  async goto(baseUrl: string) {
    await this.utils.navigateTo(baseUrl);
  }

  async login(username: string, password: string) {
    await this.utils.fillInput(this.usernameInput, username);
    await this.utils.fillInput(this.passwordInput, password);
    await this.utils.clickElement(this.loginButton);
  }

  async getErrorMessage(): Promise<string> {
    return this.utils.getText(this.errorMessage);
  }
} 