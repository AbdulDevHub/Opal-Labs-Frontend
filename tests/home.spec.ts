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
  await page.getByRole('banner').getByRole('button', { name: 'Log In' }).click()
  await expect(page.getByText('Sign in with Google')).toBeVisible()
})
