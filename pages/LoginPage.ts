import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
  page: Page;
  loginField: Locator;
  passwordField: Locator;
  signInButton: Locator;
  errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginField = page.locator('#login_field');
    this.passwordField = page.locator('#password');
    this.signInButton = page.locator('input[name="commit"]');
    this.errorMessage = page.locator('#js-flash-container .flash-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username: string, password: string) {
    await this.loginField.fill(username);
    await this.passwordField.fill(password);
    await this.signInButton.click();
  }

  async assertOnLoginPage() {
    const currentUrl = await this.page.url();
    expect(currentUrl).toMatch(/github\.com\/(login|session)/);
  }

  async assertErrorContains(text: string) {
    await expect(this.errorMessage).toContainText(text);
  }
}
