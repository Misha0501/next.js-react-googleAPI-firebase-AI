import { test, expect } from '@playwright/test'

// You can override the default Playwright test timeout of 30s
test.setTimeout(5_000);

test.beforeEach(async ({ page }) => {
  // before each test, navigate to the home page
  const targetUrl = process.env.ENVIRONMENT_URL || 'http://localhost:3000'
  await page.goto(targetUrl)
});

test.afterEach(async ({ page }) => {
  // after each test, take a screenshot of the page
  await page.screenshot({ path: "screenshot.jpg" });
});

test.describe('Search functionality', () => {
  test('autocomplete is working and provides proper results', async ({ page }) => {
    await page.waitForTimeout(3000);

    // Get the search input
    const searchInput = await page.locator('input[name="locality"]');

    // Press keys one by one to simulate typing in the autocomplete input
    await searchInput.pressSequentially('Sof');

    // Wait for the autocomplete to appear
    await page.waitForSelector('.pac-container');

    // Check that the autocomplete is visible
    expect(await page.isVisible('.pac-container')).toBeTruthy();

    // Click on the first option
    await page.click('.pac-container .pac-item:first-of-type');

    // Check that the input value is correct
    expect(await searchInput.inputValue()).toContain('Sofia');
  })

  test('should navigate to listings page once submitted', async ({ page }) => {
    // Get the hero header search form
    const searchForm = await page.locator('.hero__inner form');

    // Submit the form search form with the default values
    await searchForm.click('button[type="submit"]');

    // Wait for the page to load not using the waitForNavigation method
    await page.waitForRequest(request => request.url().includes('/listings'));

    // wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that the page is loaded
    expect(page.url()).toContain('/listings');
  })

  test('should navigate to listings page once popular search is clicked', async ({ page }) => {
    // Click on a popular search
    await page.click('.hero__popular-searches a:first-of-type');

    // Wait for the page to load not using the waitForNavigation method
    await page.waitForRequest(request => request.url().includes('/listings'));

    // wait for page to load
    await page.waitForLoadState('networkidle');

    // Check that the page is loaded
    expect(page.url()).toContain('/listings');
  })

  test('rent sell buttons should be outlined if selected ', async ({ page }) => {
    const rentBtnSelector = 'button:has-text("Rent")';
    const butBtnSelector = 'button:has-text("Buy")';

    // Click on a button with the text 'Rent'
    await page.click(rentBtnSelector);

    // Check that the selecte button has the selected data attribute
    expect(await page.getAttribute(rentBtnSelector, 'area-selected')).toBe('true');
  })
})

