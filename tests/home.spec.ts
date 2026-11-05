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
  await expect(page).toHaveURL(/\/api\/auth\/signin|accounts\.google\.com/, { timeout: 20000 })
})

test('homepage dark mode switch flips the theme and is remembered', async ({ page }) => {
  await page.goto('/')
  const html = page.locator('html')
  const before = await html.getAttribute('data-theme')
  const next = before === 'dark' ? 'light' : 'dark'
  await page.getByRole('button', { name: `Switch to ${next} mode` }).click()
  await expect(html).toHaveAttribute('data-theme', next)
  await page.reload()
  await expect(html).toHaveAttribute('data-theme', next)
})

test('the homepage playground is a working editor that resets', async ({ page }) => {
  await page.goto('/')
  await page.getByText('Playground · not saved').scrollIntoViewIfNeeded()
  const playground = page.locator('#playground')
  const firstBlock = playground.getByRole('textbox').first()
  await expect(firstBlock).toBeVisible({ timeout: 15000 })
  const original = await firstBlock.inputValue()

  await firstBlock.click()
  await page.keyboard.press('End')
  await page.keyboard.type(' edited')
  await expect(firstBlock).toHaveValue(`${original} edited`)

  await playground.getByRole('button', { name: 'Reset' }).click()
  await expect(playground.getByRole('textbox').first()).toHaveValue(original)
})

test('unknown pages show the custom 404', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '404' })).toBeVisible()
  await expect(page.getByText('/this-page-does-not-exist')).toBeVisible()
  await page.getByRole('link', { name: 'Back home' }).click()
  await expect(page).toHaveURL(/\/$/)
})
