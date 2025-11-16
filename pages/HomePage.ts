import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
  page: Page;
  userMenuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userMenuButton = page.getByRole('button', { name: /Open user navigation menu/i });
  }

  async assertLoggedIn() {
    await expect(this.userMenuButton).toBeVisible();
  }
}
