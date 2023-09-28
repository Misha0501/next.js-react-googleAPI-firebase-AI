import { test, expect } from '@playwright/test'

// You can override the default Playwright test timeout of 30s
// test.setTimeout(60_000);

test('Custom Browser Check', async ({ page }) => {
  const targetUrl = process.env.ENVIRONMENT_URL || 'https://real-estate-website-two-eta.vercel.app/'
  const response = await page.goto(targetUrl)
  expect(response?.status()).toBeLessThan(400)
  await page.screenshot({ path: 'screenshot.jpg' })
})


test('Custom Browser Check Two', async ({ page }) => {
  const targetUrl = process.env.ENVIRONMENT_URL
  const response = await page.goto(targetUrl)
  expect(response?.status()).toBeLessThan(400)
  await page.screenshot({ path: 'screenshot.jpg' })
})