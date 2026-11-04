import { expect, test } from '@playwright/test'

// Guest mode keeps everything in localStorage, so these tests need no backend.

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.getByRole('banner').getByRole('button', { name: 'Try Without Signing In' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
})

test('guest starts with the welcome page', async ({ page }) => {
  await expect(page.getByText('Guest mode: saved in this browser')).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Untitled' })).toHaveValue('Welcome!')
})

test('guest can create, rename and save a page that survives a reload', async ({ page }) => {
  await page.getByRole('button', { name: '+ New Page' }).click()
  const title = page.getByRole('textbox', { name: 'Untitled' })
  await expect(title).toHaveValue('Untitled')
  await title.fill('Playwright Page')
  await page.getByRole('button', { name: 'Save' }).click()

  await page.reload()
  await expect(page.getByRole('button', { name: 'Playwright Page' }).first()).toBeVisible()
})

test('guest can add an element', async ({ page }) => {
  await page.getByRole('button', { name: '+ New Element' }).click()
  await expect(page.getByRole('menuitem').first()).toBeVisible()
})
