import type { PageType } from '@/hooks/Page/usePageList'

import { parsePageEtc } from './blocks/types'

/** Helpers for the page tree shown in the sidebar and breadcrumbs */

export const pageName = (page?: Pick<PageType, 'page_name'>) =>
  page?.page_name && page.page_name.trim() ? page.page_name : 'Untitled'

export const pageIcon = (page?: Pick<PageType, 'etc'>) => parsePageEtc(page?.etc).icon

/** A page without a parent in the list is shown at the top level */
export const isTopLevel = (page: PageType, byId: Map<string, PageType>) =>
  !page.parent_page_uuid || !byId.has(page.parent_page_uuid)

export const childrenOf = (pages: PageType[], parentUuid: string) =>
  pages.filter((page) => page.parent_page_uuid === parentUuid)

/** Ancestors from the top-level page down to (and including) the page itself */
export const pathTo = (pages: PageType[], pageUuid: string) => {
  const byId = new Map(pages.map((page) => [page.page_uuid, page]))
  const path: PageType[] = []
  let current = byId.get(pageUuid)
  const seen = new Set<string>()
  while (current && !seen.has(current.page_uuid)) {
    seen.add(current.page_uuid)
    path.unshift(current)
    current = current.parent_page_uuid ? byId.get(current.parent_page_uuid) : undefined
  }
  return path
}

/** The page and every page nested under it */
export const withDescendants = (pages: PageType[], pageUuid: string) => {
  const ids = new Set([pageUuid])
  let grew = true
  while (grew) {
    grew = false
    pages.forEach((page) => {
      if (page.parent_page_uuid && ids.has(page.parent_page_uuid) && !ids.has(page.page_uuid)) {
        ids.add(page.page_uuid)
        grew = true
      }
    })
  }
  return ids
}

/** "just now", "5 min ago", "3 h ago", "Nov 2" */
export const relativeTime = (iso?: string) => {
  if (!iso) return ''
  const time = new Date(iso).getTime()
  if (Number.isNaN(time) || time <= 0) return ''
  const seconds = Math.max(0, (Date.now() - time) / 1000)
  if (seconds < 45) return 'just now'
  if (seconds < 3600) return `${Math.round(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.round(seconds / 3600)} h ago`
  if (seconds < 86400 * 6) return `${Math.round(seconds / 86400)} d ago`
  return new Date(time).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export const liveUrl = (pageUuid: string) =>
  `${typeof window !== 'undefined' ? window.location.origin : ''}/live/${pageUuid}`
