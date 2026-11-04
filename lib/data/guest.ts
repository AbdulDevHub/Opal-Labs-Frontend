import { v4 as uuidv4 } from 'uuid'

import type { DataSource, StoredElement, StoredPage } from './types'
import { WELCOME_ELEMENTS, WELCOME_PAGE_NAME } from './welcomeTemplate'

/**
 * Browser-only storage for guest mode. Mirrors the backend's behaviour
 * (see Opal-Labs-Backend/controllers/page.go) but keeps everything in localStorage.
 */

const STORAGE_KEY = 'opal-guest-v1'

type GuestPage = StoredPage & {
  last_updated_at: string
  view_count: number
  date_view_count: Record<string, number>
}

type GuestDB = {
  pages: Record<string, GuestPage>
  /** Elements per page, in display order */
  elements: Record<string, StoredElement[]>
}

// Used when localStorage is unavailable (private mode, blocked storage) so the demo still works
let memoryDB: GuestDB | null = null

const emptyDB = (): GuestDB => ({ pages: {}, elements: {} })

const load = (): GuestDB => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as GuestDB
  } catch {
    // fall through to the in-memory copy
  }
  return memoryDB ?? emptyDB()
}

const save = (db: GuestDB) => {
  memoryDB = db
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
  } catch {
    // storage full or blocked: keep the in-memory copy
  }
}

const now = () => new Date().toISOString()
const today = () => now().slice(0, 10)

const newPage = (fields: Partial<GuestPage> & { page_uuid: string }): GuestPage => ({
  page_name: '',
  is_root: true,
  parent_page_uuid: null,
  public_page: false,
  is_favourite: false,
  view_count: 0,
  date_view_count: {},
  last_updated_at: now(),
  ...fields,
})

/** Adds the welcome page, like the backend does for a new user */
const seedWelcomePage = (db: GuestDB) => {
  const page_uuid = uuidv4()
  db.pages[page_uuid] = newPage({ page_uuid, page_name: WELCOME_PAGE_NAME, is_root: true })
  db.elements[page_uuid] = WELCOME_ELEMENTS.map((element) => ({
    ...element,
    element_uuid: uuidv4(),
  }))
}

/** Same order as the backend: favourites first, then most recently updated */
const sortPages = (pages: GuestPage[]) =>
  pages.sort(
    (a, b) =>
      Number(b.is_favourite) - Number(a.is_favourite) ||
      b.last_updated_at.localeCompare(a.last_updated_at)
  )

/** Returns true if the page exists in this browser's guest store */
export const hasGuestPage = (pageUuid: string) => Boolean(load().pages[pageUuid])

/** Removes all guest data */
export const clearGuestData = () => {
  memoryDB = null
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    // nothing to clear
  }
}

export const guestDataSource: DataSource = {
  async listPages() {
    const db = load()
    if (Object.keys(db.pages).length === 0) {
      seedWelcomePage(db)
      save(db)
    }
    return sortPages(Object.values(db.pages))
  },

  async getPage(pageUuid) {
    const db = load()
    const page = db.pages[pageUuid]
    if (!page) throw new Error('Page not found')

    // Public pages count views, like the backend
    if (page.public_page) {
      page.view_count += 1
      page.date_view_count[today()] = (page.date_view_count[today()] ?? 0) + 1
      save(db)
    }

    const sub_pages: Record<string, string> = {}
    Object.values(db.pages)
      .filter((p) => p.parent_page_uuid === pageUuid)
      .forEach((p) => (sub_pages[p.page_uuid] = p.page_name))

    return { page: { ...page }, elements: db.elements[pageUuid] ?? [], sub_pages }
  },

  async createPage(input) {
    const db = load()
    if (!input.page_uuid) throw new Error('Page UUID cannot be empty')
    if (db.pages[input.page_uuid]) throw new Error('Page UUID already in use')

    db.pages[input.page_uuid] = newPage({
      page_uuid: input.page_uuid,
      page_name: input.page_name,
      is_root: input.is_root,
      parent_page_uuid: input.parent_page_uuid ?? null,
      public_page: input.public_page,
      is_favourite: input.is_favourite,
    })
    db.elements[input.page_uuid] = []
    save(db)
  },

  async updatePage({ page: changes, elements }) {
    const db = load()
    const page = db.pages[changes.page_uuid]
    if (!page) throw new Error('Page not found')

    if (changes.page_name) page.page_name = changes.page_name
    if (changes.is_root !== undefined) page.is_root = changes.is_root
    if (changes.is_favourite !== undefined) page.is_favourite = changes.is_favourite
    if (changes.public_page !== undefined && changes.public_page !== page.public_page) {
      // Toggling publish resets the analytics, like the backend
      page.public_page = changes.public_page
      page.view_count = 0
      page.date_view_count = {}
    }
    page.last_updated_at = now()

    if (elements !== undefined) db.elements[page.page_uuid] = elements
    save(db)
  },

  async deletePage(pageUuid) {
    const db = load()
    if (!db.pages[pageUuid]) throw new Error('Page not found')

    // Delete the page and all its sub-pages
    const remove = (uuid: string) => {
      Object.values(db.pages)
        .filter((p) => p.parent_page_uuid === uuid)
        .forEach((child) => remove(child.page_uuid))
      delete db.pages[uuid]
      delete db.elements[uuid]
    }
    remove(pageUuid)
    save(db)
  },

  async getUser() {
    // Same default plan as a new backend user, so guests can try publishing and analytics
    return { status: 'premium', name: 'Guest' }
  },

  async logout() {
    // Guest data is kept so returning visitors find their pages again
  },
}
