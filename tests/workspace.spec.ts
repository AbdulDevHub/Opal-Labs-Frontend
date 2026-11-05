import { expect, Page, test } from '@playwright/test'

// Guest-mode workspace features beyond the basics in guest.spec.ts (no backend needed)

const title = (page: Page) => page.getByRole('textbox', { name: 'Page title' })
const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Pages' })
const saved = (page: Page) =>
  expect(page.getByRole('status').filter({ hasText: 'Saved' })).toBeVisible({ timeout: 5000 })

/** Creates a new guest page with the given title and returns to its first block */
const newPage = async (page: Page, name: string) => {
  await page.getByRole('button', { name: 'New page' }).click()
  await expect(title(page)).toBeFocused()
  await page.keyboard.type(name)
  await page.keyboard.press('Enter')
}

const openRowMenu = async (page: Page, name: string) => {
  const row = sidebar(page).getByRole('button', { name, exact: true }).first()
  await row.hover()
  await page
    .getByRole('button', { name: `Options for ${name}` })
    .first()
    .click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  // A click before React hydrates does nothing
  await page.waitForLoadState('networkidle')
  await page.getByRole('banner').getByRole('button', { name: 'Demo' }).click()
  await expect(page).toHaveURL(/\/dashboard/)
  await expect(title(page)).toHaveValue('Welcome!')
})

test('sidebar can rename, favourite, duplicate and delete a page', async ({ page }) => {
  await newPage(page, 'Sidebar Page')
  await saved(page)

  await openRowMenu(page, 'Sidebar Page')
  await page.getByRole('menuitem', { name: 'Rename' }).click()
  const nameInput = page.getByRole('textbox', { name: 'Page name' })
  await nameInput.fill('Renamed Page')
  await nameInput.press('Enter')
  await expect(sidebar(page).getByRole('button', { name: 'Renamed Page' }).first()).toBeVisible()
  await expect(title(page)).toHaveValue('Renamed Page')

  await openRowMenu(page, 'Renamed Page')
  await page.getByRole('menuitem', { name: 'Add to favourites' }).click()
  await expect(sidebar(page).getByText('Favourites')).toBeVisible()
  await expect(sidebar(page).getByRole('button', { name: 'Renamed Page', exact: true })).toHaveCount(2)

  await openRowMenu(page, 'Renamed Page')
  await page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await expect(
    sidebar(page)
      .getByRole('button', { name: /Renamed Page \(copy\)|Copy of/ })
      .first()
  ).toBeVisible()

  await openRowMenu(page, 'Renamed Page')
  await page.getByRole('menuitem', { name: 'Delete' }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click()
  await expect(
    sidebar(page).getByRole('button', { name: 'Renamed Page', exact: true })
  ).toHaveCount(0)
})

test('block menu turns a block into another type, duplicates and deletes it', async ({ page }) => {
  await newPage(page, 'Block Menu Page')
  await page.keyboard.type('Turn me')

  const block = page.getByRole('textbox', { name: 'Text block' }).first()
  await block.hover()
  await page.getByRole('button', { name: 'Block options' }).first().click()
  await page.getByRole('menuitem', { name: 'Heading 2' }).click()
  const heading = page.getByRole('textbox', { name: 'Heading 2 block' })
  await expect(heading).toHaveValue('Turn me')

  await heading.hover()
  await page.getByRole('button', { name: 'Block options' }).first().click()
  await page.getByRole('menuitem', { name: 'Duplicate' }).click()
  await expect(heading).toHaveCount(2)

  await heading.first().hover()
  await page.getByRole('button', { name: 'Block options' }).first().click()
  await page.getByRole('menuitem', { name: 'Delete', exact: true }).click()
  await expect(heading).toHaveCount(1)
})

test('Enter splits a block and Backspace merges it back', async ({ page }) => {
  await newPage(page, 'Split Page')
  await page.keyboard.type('HelloWorld')
  for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowLeft')
  await page.keyboard.press('Enter')
  const blocks = page.getByRole('textbox', { name: 'Text block' })
  await expect(blocks).toHaveCount(2)
  await expect(blocks.nth(0)).toHaveValue('Hello')
  await expect(blocks.nth(1)).toHaveValue('World')

  await page.keyboard.press('Backspace')
  await expect(blocks).toHaveCount(1)
  await expect(blocks.first()).toHaveValue('HelloWorld')
})

test('a sub-page appears in the breadcrumb and opens from its parent', async ({ page }) => {
  await newPage(page, 'Parent Page')
  await page.keyboard.type('/page')
  await expect(page.getByRole('listbox', { name: 'Insert block' })).toBeVisible()
  await expect(page.getByRole('option').first()).toContainText('Page')
  await page.keyboard.press('Enter')

  // The parent stays open with a link to a new, untitled child page
  await page.getByRole('button', { name: 'Open sub-page Untitled' }).click()
  await expect(title(page)).toHaveValue('')
  await title(page).fill('Child Page')
  await saved(page)
  const crumbs = page.getByRole('list', { name: 'Breadcrumb' })
  await expect(crumbs).toContainText('Parent Page')

  await crumbs.getByRole('button', { name: 'Parent Page' }).click()
  await expect(title(page)).toHaveValue('Parent Page')
  await page.getByRole('button', { name: 'Open sub-page Child Page' }).click()
  await expect(title(page)).toHaveValue('Child Page')

  // Back and forward follow the address bar
  await page.goBack()
  await expect(title(page)).toHaveValue('Parent Page')
  await page.goForward()
  await expect(title(page)).toHaveValue('Child Page')
})

test('page options lock the page and export Markdown', async ({ page }) => {
  await newPage(page, 'Options Page')
  await page.keyboard.type('# Exported')
  await saved(page)

  await page.getByRole('button', { name: 'Page options' }).click()
  const download = page.waitForEvent('download')
  await page.getByRole('menuitem', { name: 'Export as Markdown' }).click()
  expect((await download).suggestedFilename()).toMatch(/options-page\.md$/)

  await page.getByRole('button', { name: 'Page options' }).click()
  const lock = page.getByRole('menuitem', { name: 'Lock page' })
  await lock.click()
  await expect(lock.getByRole('checkbox')).toBeChecked()
  await page.keyboard.press('Escape')
  await expect(title(page)).not.toBeEditable()
})

test('templates fill an empty page', async ({ page }) => {
  await page.getByRole('button', { name: 'New page' }).click()
  const template = page.getByRole('button', { name: /To-do list|Meeting notes|Journal/ }).first()
  await expect(template).toBeVisible()
  await template.click()
  await expect(title(page)).not.toHaveValue('')
})

test('dark mode can be picked from the account menu and survives a reload', async ({ page }) => {
  await page.getByRole('button', { name: 'Account menu' }).click()
  await page.getByRole('button', { name: 'Dark' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('the shortcuts dialog opens from the sidebar', async ({ page }) => {
  await page.getByRole('button', { name: 'Keyboard shortcuts' }).click()
  await expect(page.getByRole('dialog', { name: 'Keyboard shortcuts' })).toBeVisible()
})

test('a page can be opened straight from its URL', async ({ page }) => {
  await newPage(page, 'Linked Page')
  await saved(page)
  const url = page.url()
  expect(url).toMatch(/\?page=/)

  await sidebar(page).getByRole('button', { name: 'Welcome!' }).first().click()
  await expect(title(page)).toHaveValue('Welcome!')
  await page.goto(url)
  await expect(title(page)).toHaveValue('Linked Page')
})

test.describe('on a phone', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the sidebar opens as a drawer', async ({ page }) => {
    await page.getByRole('button', { name: 'Open sidebar' }).click()
    await expect(sidebar(page)).toBeVisible()
    await sidebar(page).getByRole('button', { name: 'Welcome!' }).first().click()
    await expect(title(page)).toHaveValue('Welcome!')
  })
})
