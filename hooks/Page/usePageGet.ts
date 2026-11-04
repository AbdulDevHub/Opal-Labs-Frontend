import { useEffect, useState } from 'react'

import { guestDataSource, hasGuestPage } from '@/lib/data/guest'
import { getDataSource, isGuest } from '@/lib/data/mode'
import { remoteDataSource } from '@/lib/data/remote'

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
  const [pageEtc, setPageEtc] = useState<Record<string, unknown>>({})
  const [subPages, setSubPages] = useState<Record<string, string>>({})
  const [notFound, setNotFound] = useState(false)

  // Running the effect whenever the page UUID changes
  useEffect(() => {
    const fetchPage = async () => {
      try {
        if (setIsLoading) setIsLoading(true)
        // Pages created in guest mode only exist in this browser, so read them locally
        // (this is what lets a guest's published page open at /live/<uuid>)
        // Any other page (e.g. someone else's published page opened by a guest) comes from the backend
        const dataSource = hasGuestPage(pageUuid)
          ? guestDataSource
          : isGuest()
          ? remoteDataSource
          : getDataSource()
        const responseData: any = await dataSource.getPage(pageUuid)
        setNotFound(false)
        setPageEtc(responseData.page.etc ?? {})
        setSubPages(responseData.sub_pages ?? {})

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
        } else {
          elements = []
        }
        setPageElements(elements)
      } catch (error) {
        console.error(`Failed to fetch page`)
        setNotFound(true)
      } finally {
        if (setIsLoading) setIsLoading(false)
      }
    }

    // Check if page UUID exists before fetching page
    if (pageUuid) {
      fetchPage()
    }
  }, [pageUuid, setIsLoading])

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
    pageEtc,
    subPages,
    notFound,
  }
}
