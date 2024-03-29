import { useCallback } from 'react'

import { v4 as uuidv4 } from 'uuid'

type PageType = {
  page_uuid: string
  page_name: string
  is_root: boolean
  element_positions: any[]
  public_page: boolean
  page_uuid_url?: string
}

/**
 * Creates a new page and sends a POST request to the server to save it. Updates the state with the new page and returns the created page.
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
    async (parentPageUUID?: string) => {
      // Creating a new page with default values
      const newPage = {
        page_uuid: uuidv4(),
        page_name: 'Untitled',
        is_root: isRoot,
        element_positions: [],
        public_page: false,
        is_favourite: false,
        parent_page_uuid: parentPageUUID,
      }

      try {
        // Making a POST request to the server to create the new page
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_OPALESCENCE_BASE_URL}/page-create`,
          {
            mode: 'no-cors',
            method: 'POST',
            body: JSON.stringify(newPage),
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Page creation failed')
        }

        const responseData = await response.json()
        console.log('Page created successfully', responseData)

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
