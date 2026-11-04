import { useCallback } from 'react'

import type { PageType } from '@/hooks/Page/usePageList'
import { getDataSource } from '@/lib/data/mode'
import { v4 as uuidv4 } from 'uuid'

/**
 * Creates a new page and saves it. Updates the state with the new page and returns the created page.
 *
 * @param {PageType[]} pages - The array of existing pages
 * @param {(pages: PageType[]) => void} setPages - A function to update the state with new pages
 * @param {boolean} isRoot - Flag indicating if the new page is a root page
 * @return {() => Promise<PageType>} A function that creates and saves a new page
 */
export const usePageCreate = (
  pages: PageType[],
  setPages: (pages: PageType[]) => void,
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

        // Update the state after successful creation
        setPages([newPage, ...pages])

        // Return the new page
        return newPage
      } catch (error) {
        console.error(`Page creation error: ${error}`)
      }
    },
    [pages, setPages, isRoot]
  )

  return createPage
}
