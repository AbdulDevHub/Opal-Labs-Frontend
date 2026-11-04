import { useCallback } from 'react'

import { getDataSource } from '@/lib/data/mode'

/**
 * Generates a custom hook for deleting a page.
 *
 * @param {string} page_uuid - The UUID of the page to be deleted
 * @return {boolean} Indicates if the page was successfully deleted
 */
export const usePageDelete = () => {
  const deletePage = useCallback(async (page_uuid: string) => {
    try {
      await getDataSource().deletePage(page_uuid)
      return true
    } catch (error) {
      console.error(`Page deletion error: ${error}`)
      return false
    }
  }, [])

  return deletePage
}
