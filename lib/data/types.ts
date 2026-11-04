/**
 * Shapes shared by the backend API and the browser-only guest store.
 * They mirror the Go backend's JSON (see Opal-Labs-Backend/api).
 */

/** An element as stored by the backend: text lives under `content.text` and `etc.text` */
export type StoredElement = {
  element_uuid: string
  type: string
  content: { text: string }
  etc: { text: string }
  size?: string | null
}

/** Page fields returned by page-list / page-get */
export type StoredPage = {
  page_uuid: string
  page_name: string
  is_root: boolean
  parent_page_uuid?: string | null
  public_page: boolean
  is_favourite: boolean
  view_count?: number
  last_updated_at?: string
  date_view_count?: Record<string, number>
  element_positions?: any[]
  page_uuid_url?: string
  /** Page extras such as the icon and cover (see lib/blocks/types PageEtc) */
  etc?: Record<string, unknown> | null
}

/** Body of page-create */
export type PageCreateInput = {
  page_uuid: string
  page_name: string
  is_root: boolean
  element_positions: any[]
  public_page: boolean
  is_favourite: boolean
  parent_page_uuid?: string
  etc?: unknown
}

/** Body of page-update. Missing page fields are left unchanged; a missing `elements` keeps the existing ones */
export type PageUpdateInput = {
  page: {
    page_uuid: string
    page_name?: string
    is_root?: boolean
    public_page?: boolean
    is_favourite?: boolean
    /** Replaces the page extras when present */
    etc?: Record<string, unknown>
  }
  elements?: StoredElement[]
}

export type PageGetResult = {
  page: StoredPage
  elements: StoredElement[]
  sub_pages?: Record<string, string>
}

export type UserResult = {
  status: string
  name?: string
  email?: string
  picture?: string
}

/** Everything the app needs from storage. Implemented by the backend client and the guest store */
export interface DataSource {
  listPages(): Promise<StoredPage[]>
  getPage(pageUuid: string): Promise<PageGetResult>
  createPage(page: PageCreateInput): Promise<void>
  updatePage(update: PageUpdateInput): Promise<void>
  deletePage(pageUuid: string): Promise<void>
  getUser(): Promise<UserResult>
  logout(): Promise<void>
}
