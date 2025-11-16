import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { credentials } from '../auth/credentials';

export const test = base.extend<{ loginAsUser: (userOverride?: { username: string; password: string }) => Promise<void> }>({
  loginAsUser: async ({ page }, use) => {
    await use(async (userOverride) => {
      const user = userOverride || credentials;
      const loginPage = new LoginPage(page);
      await loginPage.goto();
      await loginPage.login(user.username, user.password);

      const homePage = new HomePage(page);
      await homePage.assertLoggedIn();
    });
  },
});

export { expect } from '@playwright/test';
