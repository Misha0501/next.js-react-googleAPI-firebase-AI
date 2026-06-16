import { test, expect } from "@playwright/test";

// You can override the default Playwright test timeout of 30s
// test.setTimeout(30_000);
const targetBaseUrl = process.env.ENVIRONMENT_URL || "http://localhost:3000";

const targetUrl = targetBaseUrl + "/signin";

test.beforeEach(async ({ page }) => {
  await page.goto(targetUrl);
});

test.afterEach(async ({ page }) => {
  await page.screenshot({ path: "screenshot.jpg" });
  await page.close();
});

test.describe("Sign in", () => {
  test("should login using Email", async ({ page }) => {
    await page.waitForSelector("#sign-in-form");

    await page.fill('[name="email"]', "e2eTestingAccountDoNotDelete@gmail.com");
    await page.fill(
      '[name="password"]',
      "e2eTestingAccountDoNotDelete@gmail.com",
    );
    await page.click('button[type="submit"]');

    await page.waitForURL("**/profile/**");
    await page.waitForLoadState("domcontentloaded");

    expect(page.url()).toBe(`${targetBaseUrl}/profile/myAccount`);
  });
});
