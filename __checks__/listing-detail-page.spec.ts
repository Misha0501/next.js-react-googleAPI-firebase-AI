import { test, expect, Page, chromium, Browser } from "@playwright/test";

test.describe('Listings page properties', () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    const targetUrl = (process.env.ENVIRONMENT_URL ? process.env.ENVIRONMENT_URL + '/listings/1' : undefined) || 'http://localhost:3000/listings/1'
    await page.goto(targetUrl);

    // wait for page to fully load
    await page.waitForLoadState('domcontentloaded');
    await page.waitForLoadState('networkidle');
  });

  test.afterEach(async () => {
    await page.screenshot({ path: "./__checks__/screenshot.jpg" });
    // await page.close();
  });

  test('should display the title and description', async () => {
    const title = await page.textContent('h1');
    expect(title).toBeTruthy();

    const description = await page.getByTestId('description').textContent();
    expect(description).toBeTruthy();
  });

  test('should open lightbox when clicking on photos button', async () => {
    await page.getByTestId('viewAllPhotos').click();
    const lightBox = await page.$('div[role="dialog"]');
    expect(lightBox).toBeTruthy();
  });

  test('should display the price', async () => {
    const price = await page.getByTestId('priceDesktop').textContent();
    expect(price).toBeTruthy();
  });

  test('should display the map', async () => {
    const map = page.getByTestId("map");
    expect(map).toBeTruthy();
  });

  test('should display the price comparison graph', async () => {
    const priceGraph = page.getByTestId("averagePriceNeighborhoodChart");
    expect(priceGraph).toBeTruthy();
  });

  test('should display the price change graph', async () => {
    const priceGraph = page.getByTestId("priceChangeGraph");
    expect(priceGraph).toBeTruthy();
  });
});
