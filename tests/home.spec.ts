import { expect, test } from '@playwright/test'

test('homepage shows every section', async ({ page }) => {
  await page.goto('/')
  for (const name of [
    'Unleash Your Potential.',
    'Everything you need to spark brilliance',
    'One space for every part of your life',
    "It's your time to shine.",
  ]) {
    await expect(page.getByRole('heading', { name })).toBeVisible()
  }
})

test('log in leads to Google sign-in', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await page.getByRole('banner').getByRole('button', { name: 'Log In' }).click()
  // NextAuth's sign-in page (no Google keys, as in CI) or Google itself (with keys)
  await expect(page).toHaveURL(/\/api\/auth\/signin|accounts\.google\.com/)
})
