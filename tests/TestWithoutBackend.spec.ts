import test from '@playwright/test'

test('Test Homepage Created Fully', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('heading', { name: 'Unleash Your Potential.' }).click()
  await page.getByRole('heading', { name: 'For Personal Use.' }).click()
  await page.getByRole('heading', { name: 'Spark Brilliance' }).click()
  await page.getByRole('heading', { name: "It's your time to shine." }).click()
})

test('Test Login Feature Active', async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/`)
  await page.getByRole('button', { name: 'Log In' }).click()
  await page.getByText('Sign in with Google').click()
})
