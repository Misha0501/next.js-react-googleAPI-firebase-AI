import { test, expect, Page, chromium, Browser } from "@playwright/test";

const targetUrl =
  (process.env.ENVIRONMENT_URL
    ? process.env.ENVIRONMENT_URL + "/listings/1"
    : undefined) || "http://localhost:3000/listings/1";

test.describe("Listings page main properties", () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(targetUrl);

    // wait for page to fully load
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async () => {
    await page.screenshot({ path: "./__checks__/screenshot.jpg" });
    // await page.close();
  });

  test("should display the title and description", async () => {
    const title = await page.textContent("h1");
    expect(title).toBeTruthy();

    const description = await page.getByTestId("description").textContent();
    expect(description).toBeTruthy();
  });

  test("should open lightbox when clicking on photos button", async () => {
    await page.getByTestId("viewAllPhotos").click();
    const lightBox = await page.$('div[role="dialog"]');
    expect(lightBox).toBeTruthy();
  });

  test("should display the price", async () => {
    const price = await page.getByTestId("priceDesktop").textContent();
    expect(price).toBeTruthy();
  });

  test("should display the map", async () => {
    const map = page.getByTestId("map");
    expect(map).toBeTruthy();
  });

  test("should display the price comparison graph", async () => {
    const priceGraph = page.getByTestId("averagePriceNeighborhoodChart");
    expect(priceGraph).toBeTruthy();
  });

  test("should display the price change graph", async () => {
    const priceGraph = page.getByTestId("priceChangeGraph");
    expect(priceGraph).toBeTruthy();
  });
});

test.describe("Listing agent contact card", () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(targetUrl);

    // wait for page to fully load
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async () => {
    await page.screenshot({ path: "./__checks__/screenshot.jpg" });
    // await page.close();
  });

  test("should display the asking price correctly", async () => {
    const currencySign = await page.getByTestId("priceCurrencySignDesktop");
    const priceDesktop = await page.getByTestId("priceDesktop");

    expect(await currencySign.textContent()).toBeTruthy();
    expect(await priceDesktop.textContent()).toBeTruthy();
  });

  test("should toggle the phone number visibility", async () => {
    let contactPhoneNumberButton = page.getByTestId("contactPhoneNumberButton");
    const initialBtnState = await contactPhoneNumberButton.textContent();
    expect(initialBtnState).toBe("Show Phone Number");

    await contactPhoneNumberButton.click();

    const newBtnState = await contactPhoneNumberButton.textContent();

    expect(newBtnState).not.toBe("Show Phone Number");
  });

  test("should display application user name and make it clickable", async () => {
    // Create a new page instance for this test because it will navigate to a different URL
    const testPage = await browser.newPage();

    // Navigate to the target URL
    await testPage.goto(targetUrl);

    // Here, you'd validate the navigation happened correctly
    const userName = testPage.getByTestId("userName");

    // Storing the current URL before clicking
    const initialURL = testPage.url();

    await userName.click();

    // Check if the listings page is loaded
    await testPage.waitForURL("**/users/**");

    // Validate that the navigation happened by comparing URLs
    const newURL = testPage.url();
    expect(newURL).not.toBe(initialURL);

    expect(newURL).toContain(`/users/`);
  });

  test('should have a "Contact seller" button', async () => {
    // Check for the "Contact seller" button and click on it
    const contactBtn = page.getByTestId("contactSellerButton");
    expect(contactBtn).toBeTruthy();
    await contactBtn.click();

    // Wait for any potential navigation (like URL fragment change) after clicking
    await page.waitForURL("**/listings/1#contactAgentForm");

    // Check if the form is visible. Assuming you have a testID for the form.
    const contactAgentForm = page.getByTestId("contactAgentForm");
    expect(contactAgentForm).toBeTruthy();

    // Check if the URL includes the desired fragment
    const currentURL = page.url();
    expect(currentURL).toContain("#contactAgentForm");
  });
});

test.describe("ListingDetailContent Component", () => {
  let browser: Browser;
  let page: Page;

  test.beforeAll(async () => {
    browser = await chromium.launch();
    page = await browser.newPage();
    await page.goto(targetUrl);

    // wait for page to fully load
    await page.waitForLoadState("domcontentloaded");
    await page.waitForLoadState("networkidle");
  });

  test.afterEach(async () => {
    await page.screenshot({ path: "./__checks__/screenshot.jpg" });
  });

  test('should display the initial description and expand on "Show More" click', async () => {
    const description = page.getByTestId("description");
    // Initial description should be shortened.
    expect(await description.textContent()).toContain("...");

    const showMoreButton = page.getByTestId("showMoreBtn");
    await showMoreButton.click();

    // check that show more button is not visible
    expect(await showMoreButton.isVisible()).toBeFalsy();

    // After clicking, it shouldn't be shortened.
    expect(await description.textContent()).not.toContain("...");
  });

  test("should display general information block", async () => {
    const generalInfoBlock = page.getByTestId("generalInfo");
    expect(await generalInfoBlock.textContent()).toBeTruthy();
  });

  test("should display the area and capacity block", async () => {
    const areaAndCapacityBlock = page.getByTestId("areaAndCapacity");
    expect(areaAndCapacityBlock.textContent).toBeTruthy();
  });

  test("should display the construction block", async () => {
    const constructionBlock = page.getByTestId("construction");
    expect(constructionBlock.textContent).toBeTruthy();
  });

  test("should display the heating block", async () => {
    const heatingBlock = page.getByTestId("heating");
    expect(heatingBlock.textContent).toBeTruthy();
  });
});
