import { expect, Page, test } from '@playwright/test'

// Guest mode keeps everything in localStorage, so these tests need no backend.

const title = (page: Page) => page.getByRole('textbox', { name: 'Page title' })

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // A click before React hydrates does nothing
  await page.waitForLoadState('networkidle')
  await page.getByRole('banner').getByRole('button', { name: 'Demo' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
})

test('guest starts with the welcome page', async ({ page }) => {
  await expect(page.getByText('Guest mode: saved in this browser')).toBeVisible()
  await expect(title(page)).toHaveValue('Welcome!')
})

test('guest can create a page with blocks that survives a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'New page' }).click()
  await expect(title(page)).toBeFocused()
  await page.keyboard.type('Playwright Page')
  await page.keyboard.press('Enter')
  // Markdown shortcuts turn into blocks
  await page.keyboard.type('# A heading')
  await page.keyboard.press('Enter')
  await page.keyboard.type('- first item')
  await page.keyboard.press('Enter')
  await page.keyboard.type('second item')
  await expect(page.getByRole('status').filter({ hasText: 'Saved' })).toBeVisible({ timeout: 5000 })

  await page.reload()
  await expect(title(page)).toHaveValue('Playwright Page')
  await expect(page.getByRole('textbox', { name: 'Heading 1 block' })).toHaveValue('A heading')
  await expect(page.getByRole('textbox', { name: 'List block' })).toHaveCount(2)
  await expect(page.getByRole('button', { name: 'Playwright Page' }).first()).toBeVisible()
})

test('slash menu inserts a block', async ({ page }) => {
  await page.getByRole('button', { name: 'New page' }).click()
  await page.keyboard.press('Enter')
  await page.keyboard.type('/todo')
  await expect(page.getByRole('listbox', { name: 'Insert block' })).toBeVisible()
  await page.keyboard.press('Enter')
  await page.keyboard.type('Write tests')
  await expect(page.getByRole('textbox', { name: 'To-do block' })).toHaveValue('Write tests')
})

test('command palette finds pages', async ({ page }) => {
  await expect(title(page)).toHaveValue('Welcome!')
  await page.keyboard.press('Control+k')
  await page.keyboard.type('welc')
  await expect(page.getByRole('option').first()).toContainText('Welcome!')
})
