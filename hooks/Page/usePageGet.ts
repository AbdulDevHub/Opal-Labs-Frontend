import { useEffect, useState } from 'react'

/**
 * Retrieves page data based on the provided UUID.
 *
 * @param {string} pageUuid - The unique identifier of the page to fetch.
 * @param {Function} setIsLoading - A function to set the loading state.
 * @return {Object} An object containing page title, root status, page elements, and favorite status.
 */
export const usePageGet = (pageUuid: string, setIsLoading?: (isLoading: boolean) => void) => {
  // State variables for storing page data
  const [pageTitle, setPageTitle] = useState('')
  const [isRoot, setIsRoot] = useState(false)
  const [dateViewCount, setDateViewCount] = useState<Record<string, number>>({})
  const [isPublicPage, setIsPublicPage] = useState(false)
  const [pageElements, setPageElements] = useState<
    { element_uuid: string; type: string; content: string; elementStyling: string }[]
  >([])
  const [isFavourited, setIsFavourited] = useState(false)

  // Running the effect whenever the page UUID changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        if (setIsLoading) setIsLoading(true)
        // Making a GET request to the server to fetch the page
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/page-get/${pageUuid}`,
          {
            method: 'GET',
            credentials: 'include',
          }
        )

        if (!response.ok) {
          throw new Error('Failed to fetch page')
        }

        // Parsing the response data
        const responseData = await response.json()
        console.log('Fetched page successfully', responseData)

        // Set the state from the response data
        setPageTitle(responseData.page.page_name)
        setIsRoot(responseData.page.is_root)
        setIsFavourited(responseData.page.is_favourite)
        setIsPublicPage(responseData.page.public_page)
        setDateViewCount(responseData.page.date_view_count)

        let elements
        // If elements exist in the response data
        if (responseData.elements && responseData.elements.length > 0) {
          // Transform the elements field to match the required format
          elements = responseData.elements.map((element: any) => ({
            type: element.type,
            // Extract string from element.content which is in form {string}
            // Check if element.content and element.content.text exist before trying to access them
            content: element.content && element.content.text ? element.content.text : '',
            // Extract string from element.etc which is in form {string}
            // Check if element.etc and element.etc.text exist before trying to access them
            // Note that etc in backend and elementStyling is the same thing,
            // I just didn't change it b/c it would cause trouble for other devs.
            // To fix it, you just need to replace all elementStyling and element_styling in project with "etc"
            elementStyling: element.etc && element.etc.text ? element.etc.text : '',
            element_uuid: element.element_uuid,
          }))
          console.log('Elements set to this value:', elements)
        } else {
          elements = []
          console.log('No elements found in response data, setting to empty array')
        }
        setPageElements(elements)
      } catch (error) {
        console.error(`Failed to fetch page`)
      } finally {
        if (setIsLoading) setIsLoading(false)
      }
    }

    // Check if page UUID exists before fetching page
    if (pageUuid) {
      fetchPage()
    }
  }, [pageUuid])

  // Return page data & functions to update them
  return {
    pageTitle,
    setPageTitle,
    isRoot,
    dateViewCount,
    pageElements,
    setPageElements,
    isFavourited,
    setIsFavourited,
    isPublicPage,
    setIsPublicPage,
  }
}
