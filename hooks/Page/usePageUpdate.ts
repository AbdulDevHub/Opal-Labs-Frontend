import { useCallback } from 'react'

import { getDataSource } from '@/lib/data/mode'
import type { PageUpdateInput } from '@/lib/data/types'

/**
 * Updates a page with the provided information.
 *
 * @param {string} pageUuid - The UUID of the page to be updated
 * @param {string} updatedTitle - The updated title of the page
 * @param {boolean} isRoot - Indicates whether the page is a root page
 * @param {any[]} updatedContent - The updated content of the page (optional)
 * @param {boolean} isFavourite - Indicates whether the page is a favorite (optional)
 * @param {boolean} publicPage - Indicates whether the page is published (optional)
 * @param {object} etc - Page extras such as icon and cover (optional, replaces the saved ones)
 * @return {boolean} Indicates whether the page was successfully updated
 */
export const usePageUpdate = () => {
  const updatePage = useCallback(
    async (
      pageUuid: string,
      updatedTitle?: string,
      isRoot?: boolean,
      updatedContent?: any[],
      isFavourite?: boolean,
      publicPage?: boolean,
      etc?: Record<string, unknown>
    ) => {
      try {
        // Preparing the page data to be sent to the backend
        const pageData: {
          page_uuid: string
          page_name?: string
          is_root?: boolean
          public_page?: boolean
          is_favourite?: boolean
          etc?: Record<string, unknown>
        } = {
          page_uuid: pageUuid,
        }

        // If Defined, add it to the page data
        if (updatedTitle !== undefined) pageData.page_name = updatedTitle
        if (isRoot !== undefined) pageData.is_root = isRoot
        if (isFavourite !== undefined) pageData.is_favourite = isFavourite
        if (publicPage !== undefined) pageData.public_page = publicPage
        if (etc !== undefined) pageData.etc = etc

        // Note that etc in backend and elementStyling is the same thing,
        // I just didn't change it b/c it would cause trouble for other devs.
        // To fix it, you just need to replace all elementStyling and element_styling in project with "etc"
        let updatedContentForBackend: any[] = []
        // If pageElements was updated/provided, add it to the page data
        if (updatedContent !== undefined) {
          updatedContentForBackend = updatedContent.map(
            ({ content, elementStyling, ...element }) => {
              return {
                ...element,
                content: { text: content },
                etc: { text: elementStyling }, // use the destructured elementStyling here
              }
            }
          )

        }

        // Define a type for the backend data
        type BackendData = {
          page: typeof pageData
          elements?: typeof updatedContentForBackend
        }

        // Prepare the backend data
        let backendData: BackendData = { page: pageData }

        // If updatedContent is not undefined, add elements to the backend data
        if (updatedContent !== undefined) backendData.elements = updatedContentForBackend

        await getDataSource().updatePage(backendData as PageUpdateInput)

        return true
      } catch (error) {
        console.error(`Failed to update page: ${error}`)
        return false
      }
    },
    []
  )

  return updatePage
}
