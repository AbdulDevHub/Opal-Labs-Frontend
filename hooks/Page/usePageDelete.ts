import { useCallback } from 'react'

/**
 * Generates a custom hook for deleting a page.
 *
 * @param {string} page_uuid - The UUID of the page to be deleted
 * @return {boolean} Indicates if the page was successfully deleted
 */
export const usePageDelete = () => {
  const deletePage = useCallback(async (page_uuid: string) => {
    try {
      // Making a POST request to the server to delete the page
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/page-delete`, {
        method: 'POST',
        body: JSON.stringify({ page_uuid }),
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Page deletion failed')
      }

      console.log('Page deleted successfully')
      return true
    } catch (error) {
      console.error(`Page deletion error: ${error}`)
      return false
    }
  }, [])

  return deletePage
}
