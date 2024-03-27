import { expect, test } from '@playwright/test'

test('Homepage & Dashboard Test With Backend Not Active', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.goto(`${baseURL}/dashboard`)
  await page.getByLabel('', { exact: true }).check()
  await page.getByLabel('', { exact: true }).uncheck()
  await page.getByRole('banner').getByRole('button').nth(1).click()
  await page.getByRole('banner').getByRole('button').nth(1).click()
  await page.getByPlaceholder('Untitled').click()
  await page.getByPlaceholder('Untitled').fill('My Name Is Bob')
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('button', { name: 'Sign Out' }).click()
})

test('Try Creating Header 1', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Text ▶' }).click()
  await page.getByRole('menuitem', { name: 'Heading 1' }).click()
  await page.getByRole('textbox').nth(1).fill('Heading 1')
  await page.getByRole('main').click()
})

test('Try Creating Callout', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Callout' }).click()
  await page.getByRole('textbox').nth(1).fill('This Is A Callout')
  await page.getByText('💡').click()
})

test('Try Creating Code Block', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Code Block' }).click()
  await page.locator('div:nth-child(3) > div > div > div').first().click()
  await page.locator('textarea').fill('const java = "javascript\n\n')
  await page.getByRole('main').click()
})

test('Try Creating Web Embed', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Web Embed' }).click()
  await page.locator('#iframeDiv').click()
  await page.getByRole('main').click()
})

test('test', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Nested Page' }).click()
})

test('Try Creating Two Headings', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Text ▶' }).click()
  await page.getByRole('menuitem', { name: 'Heading 1' }).click()
  await page.getByRole('textbox').nth(1).fill('g')
  await page.getByRole('main').click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Text ▶' }).click()
  await page.getByRole('menuitem', { name: 'Heading 2' }).click()
  await page.getByRole('textbox').nth(2).fill('g')
})

test('Try Creating Two Web Embeds', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Web Embed' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Web Embed' }).click()
})

test('Try Creating Two Code Blocks', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('link', { name: 'Testing Shortcut - Dashboard' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Code Block' }).click()
  await page.getByRole('button', { name: '+ New Element' }).click()
  await page.getByRole('menuitem', { name: 'Code Block' }).click()
  // Check if elements are visible
  await expect(page.locator('div:nth-child(3) > div > div > div').first()).toBeVisible()
  await expect(page.locator('.MuiBox-root > div:nth-child(2) > div > div').first()).toBeVisible()
})
