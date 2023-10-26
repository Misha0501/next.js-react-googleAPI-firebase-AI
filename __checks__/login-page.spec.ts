import { test, expect } from '@playwright/test'

// You can override the default Playwright test timeout of 30s
// test.setTimeout(30_000);
const targetBaseUrl = process.env.ENVIRONMENT_URL || 'http://localhost:3000'

const targetUrl = targetBaseUrl + '/signin'

test.beforeEach(async ({ page }) => {
  // before each test, navigate to the login page
  await page.goto(targetUrl)
});

test.afterEach(async ({ page }) => {
  // after each test, take a screenshot of the page
  await page.screenshot({ path: "screenshot.jpg" });
  await page.close();
});

test.describe('Firebase Authentication UI', () => {
  test('should login using Email', async ({page}) => {
    // Wait for Firebase UI to be loaded
    await page.waitForSelector('.firebaseui');

    // Click the Email Auth method
    await page.click('[data-provider-id="password"]');

    // Fill in the email field
    await page.fill('[name="email"]', 'e2eTestingAccountDoNotDelete@gmail.com');

    // Submit the form
    await page.click('button[type="submit"]');

    // Fill in the password fields
    await page.fill('[name="password"]', 'e2eTestingAccountDoNotDelete@gmail.com');

    // Submit the form
    await page.click('button[type="submit"]');

    // Verify redirection after successful login
    await page.waitForURL('**/profile/**');

    // wait for page to fully load
    await page.waitForLoadState('domcontentloaded');

    expect(page.url()).toBe(`${targetBaseUrl}/profile/myAccount`);
  });
})

