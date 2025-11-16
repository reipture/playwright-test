import { test, expect } from '../fixtures/testWithFixtures';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { credentials } from '../auth/credentials';

const missingCredentials =
  !credentials.username ||
  credentials.username === 'github_login' ||
  !credentials.password ||
  credentials.password === 'github_password';

test.skip(missingCredentials, 'Configure valid GitHub credentials in auth/credentials.ts');

test.describe('GitHub login with POM and fixtures', () => {
  test('successful login via POM only', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);

    await loginPage.goto();
    await loginPage.login(credentials.username, credentials.password);
    await homePage.assertLoggedIn();
  });

  test('successful login via loginAsUser fixture', async ({ page, loginAsUser }) => {
    await loginAsUser();

    const homePage = new HomePage(page);
    await homePage.assertLoggedIn();
  });

  test('negative login attempt with wrong password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login(credentials.username, 'wrong-password');

    await loginPage.assertOnLoginPage();
    await loginPage.assertErrorContains('Incorrect username or password');
  });
});
