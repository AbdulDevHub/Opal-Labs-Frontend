import { Dispatch, SetStateAction, useCallback } from 'react'

import type { PageType } from '@/hooks/Page/usePageList'
import { getDataSource } from '@/lib/data/mode'
import { v4 as uuidv4 } from 'uuid'

/**
 * Creates a new page and saves it. Updates the state with the new page and returns the created page.
 *
 * @param {PageType[]} pages - The existing pages (kept for the old signature; the update reads the latest list)
 * @param {(pages: PageType[]) => void} setPages - A function to update the state with new pages
 * @param {boolean} isRoot - Flag indicating if the new page is a root page
 * @return {() => Promise<PageType>} A function that creates and saves a new page
 */
export const usePageCreate = (
  pages: PageType[],
  setPages: Dispatch<SetStateAction<PageType[]>>,
  isRoot: boolean
) => {
  const createPage = useCallback(
    async (parentPageUUID?: string, pageName = 'Untitled', etc?: Record<string, unknown>) => {
      // Creating a new page with default values
      const newPage = {
        page_uuid: uuidv4(),
        page_name: pageName,
        is_root: isRoot,
        element_positions: [],
        public_page: false,
        is_favourite: false,
        parent_page_uuid: parentPageUUID,
        last_updated_at: new Date().toISOString(),
        etc: etc ?? null,
      }

      try {
        await getDataSource().createPage(newPage)

        // Functional update: an async caller may hold a stale `pages` (e.g. a sub-page made right
        // after its parent), and writing that back would drop the newer pages
        setPages((prev) => [newPage, ...prev])

        // Return the new page
        return newPage
      } catch (error) {
        console.error(`Page creation error: ${error}`)
      }
    },
    [setPages, isRoot]
  )

  return createPage
}
