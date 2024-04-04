import test from '@playwright/test'

test('Test Homepage Created Fully', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('heading', { name: 'Flexible Functionality' }).click()
  await page.getByRole('heading', { name: 'Key Features' }).click()
  await page.getByRole('heading', { name: 'Community Insights' }).click()
  await page.getByText('© Opalescence 2024 911-911-').click()
  await page.getByText('OpalescenceLogin').click()
})

test('Test Login Feature Active', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('button', { name: 'Login' }).click()
  await page.getByText('Sign in with Google').click()
})
