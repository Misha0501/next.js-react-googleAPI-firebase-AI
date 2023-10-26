import { test, expect, Page } from "@playwright/test";

// You can override the default Playwright test timeout of 30s
test.setTimeout(20_000);

test.beforeEach(async ({ page }) => {
  // before each test, navigate to the listings page
  const targetUrl = (process.env.ENVIRONMENT_URL ? process.env.ENVIRONMENT_URL + '/listings' : undefined) || 'http://localhost:3000/listings'
  await page.goto(targetUrl)
  // wait for page to fully load
  await page.waitForLoadState('domcontentloaded');
});

test.afterEach(async ({ page }) => {
  // after each test, take a screenshot of the page
  await page.screenshot({ path: "screenshot.jpg" });
});


test.describe('Filters values should trigger a change url and a request once selected for', () => {
  const minMaxFiltersConfigs = [
    { paramName: 'priceMin', value: 50000, locator: '#priceFilterMin', description: 'min price filter' },
    { paramName: 'priceMax', value: 75000, locator: '#priceFilterMax', description: 'max price filter' },
    { paramName: 'areaLivingMin', value: 50, locator: '#livingAreaRangeFilterMin', description: 'min living area range filter' },
    { paramName: 'areaLivingMax', value: 75, locator: '#livingAreaRangeFilterMax', description: 'max living area range filter' },
    { paramName: 'areaTotalMin', value: 100, locator: '#areaTotalFilterMin', description: 'min total area range filter' },
    { paramName: 'areaTotalMax', value: 150, locator: '#areaTotalFilterMax', description: 'max total area range filter' },
    { paramName: 'roomsMin', value: 1, locator: '#roomRangeFilterMin', description: 'min rooms range filter' },
    { paramName: 'roomsMax', value: 2, locator: '#roomRangeFilterMax', description: 'max rooms range filter' },
    { paramName: 'bedroomsMin', value: 1, locator: '#bedroomRangeFilterMin', description: 'min bedrooms range filter' },
    { paramName: 'bedroomsMax', value: 2, locator: '#bedroomRangeFilterMax', description: 'max bedrooms range filter' },
  ];

  for (const config of minMaxFiltersConfigs) {
    test(config.description, async ({ page }: { page: Page }) => {
      await testMinMaxxFilter(config.paramName, config.value, config.locator, page);
    });
  }
});

test.describe('Radio button filter values should trigger a change url and a request once selected for', () => {
  const radioConfigs = [
    { queryParam: 'listedSince', value: '0', locator: 'input[id="listedSinceFilter0"]', description: 'No preference' },
    { queryParam: 'listedSince', value: '1', locator: 'input[id="listedSinceFilter1"]', description: 'Last 24 hours' },
    { queryParam: 'listedSince', value: '3', locator: 'input[id="listedSinceFilter2"]', description: '3 days' },
    { queryParam: 'listedSince', value: '7', locator: 'input[id="listedSinceFilter3"]', description: '7 days' },
    { queryParam: 'listedSince', value: '10', locator: 'input[id="listedSinceFilter4"]', description: '10 days' },
    { queryParam: 'listedSince', value: '30', locator: 'input[id="listedSinceFilter5"]', description: '30 days' },
  ];

  for (const config of radioConfigs) {
    test(`listed since filter: ${config.description}`, async ({ page }: { page: Page }) => {
      await testRadioSelection(config.queryParam, config.value, '#listedSinceFilter', config.locator, page);
    });
  }
});

test.describe('Checkbox should be valid and selectable when selecting for property type filter ', () => {
  const checkboxConfigs = [
    { queryParam: 'propertyType', value: 'HOUSE', locator: 'input[id="propertyTypeFilterHOUSE"]', description: 'House' },
    { queryParam: 'propertyType', value: 'APARTMENT', locator: 'input[id="propertyTypeFilterAPARTMENT"]', description: 'Apartment' },
    { queryParam: 'propertyType', value: 'APARTMENT', locator: 'input[id="propertyTypeFilterPARKING"]', description: 'Parking' },
    { queryParam: 'propertyType', value: 'APARTMENT', locator: 'input[id="propertyTypeFilterLAND"]', description: 'Land' },
  ];

  for (const config of checkboxConfigs) {
    test(`${config.description}`, async ({ page }: { page: Page }) => {
      await testCheckboxSelection(config.queryParam, config.value, '#propertyTypeFilter', config.locator, page);
    });
  }
});

/**
 * Test min/max filters
 * @param filterQueryParam
 * @param expectedValue
 * @param filterLocatorId
 * @param page
 */
const testMinMaxxFilter = async (
  filterQueryParam: string,
  expectedValue: number,
  filterLocatorId: string,
  page: Page
) => {
  let requestMade = false;

  // Intercept network requests
  await page.route(`**/listings**${filterQueryParam}=${expectedValue}**`, (route) => {
    requestMade = true;
    route.continue();
  });

  const filterLocator = page.locator(filterLocatorId);

  // Click the filter select button
  await page.click(filterLocatorId);

  // Make sure the items are visible
  await page.waitForSelector(`${filterLocatorId} ul`);

  // Click the second item in the dropdown (as per your sample)
  await page.click(`${filterLocatorId} ul li:nth-child(2)`);

  // Check if URL contains the right query params
  await page.waitForURL(`**/listings**${filterQueryParam}=${expectedValue}**`);

  // Make sure the right item is selected
  const selectedValue = await filterLocator.locator('button span:first-of-type').innerText();
  expect(selectedValue).toContain(expectedValue.toString());

  // Check if the right request was made
  expect(requestMade).toBe(true);
};

/**
 * Test radio button selection
 * @param queryParam
 * @param expectedValue
 * @param parentComponentId
 * @param radioLocatorId
 * @param page
 */
const testRadioSelection = async (
  queryParam: string,
  expectedValue: string,
  parentComponentId: string,
  radioLocatorId: string,
  page: Page
) => {
  let requestMade = false;

  // Create a locator for the parent component
  const parentComponent = page.locator(parentComponentId);

  // Intercept network requests
  await page.route(`**/listings**${queryParam}=${expectedValue}**`, (route) => {
    requestMade = true;
    route.continue();
  });

  // Click the radio button within the parent component
  await parentComponent.locator(radioLocatorId).click();

  // Check if URL contains the right query params
  await page.waitForURL(`**/listings**${queryParam}=${expectedValue}**`);

  // Verify the radio button is selected
  const isSelected = await parentComponent.locator(radioLocatorId).isChecked();
  expect(isSelected).toBe(true);

  // Check if the right request was made
  expect(requestMade).toBe(true);
};

const testCheckboxSelection = async (
  baseQueryParam: string,
  value: string,
  parentComponentId: string,
  checkboxLocatorId: string,
  page: Page
) => {
  // TODO: check for the right request to be made

  // Click the checkbox within the parent component
  await page.locator(`${parentComponentId} ${checkboxLocatorId}`).click();

  // Verify the checkbox is selected
  const isSelected = await page.locator(`${parentComponentId} ${checkboxLocatorId}`).isChecked();
  expect(isSelected).toBe(true);
};
