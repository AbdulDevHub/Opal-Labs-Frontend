import { useEffect, useState } from 'react'

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
 * Returns a tuple containing the current page list and a function to update the page list.
 *
 * @return {[PageType[], React.Dispatch<React.SetStateAction<PageType[]>>]} The current page list and a function to update the page list.
 */
export const usePageList = (): [PageType[], React.Dispatch<React.SetStateAction<PageType[]>>] => {
  // State variable for storing the list of pages
  const [pages, setPages] = useState<PageType[]>([])

  useEffect(() => {
    const fetchPageList = async () => {
      try {
        // Make a GET request to the server to fetch the list of pages
        const response = await fetch(`${process.env.NEXT_PUBLIC_OPALESCENCE_BASE_URL}/page-list`, {
          mode: 'no-cors',
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch page list')
        }

        // Parse the response data
        const responseData = await response.json()
        console.log('Fetched page list successfully', responseData)

        // If pages exist in the response data
        if (responseData.pages && responseData.pages.length > 0) {
          // Updating the state with the fetched list of pages
          console.log('Pages:', responseData.pages)
          setPages([...responseData.pages])
        }

        // Otherwise create an empty page if page list is empty
        else {
          // Create an empty page
          const EmptyPage = {
            page_uuid: uuidv4(),
            page_name: 'Page 1',
            is_root: false,
            element_positions: [],
            public_page: true,
            is_favourite: false,
            etc: null,
          }

          try {
            // Make a POST request to the server to create a new page
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_OPALESCENCE_BASE_URL}/page-create`,
              {
                method: 'POST',
                body: JSON.stringify(EmptyPage),
                credentials: 'include',
              }
            )

            if (!response.ok) {
              throw new Error('Page creation failed')
            }

            // Parse the response data
            const responseData = await response.json()
            console.log('Page created successfully', responseData)

            // Call fetchPageList again after successful creation
            fetchPageList()
          } catch (error) {
            console.error(`Page creation error: ${error}`)
          }
        }
      } catch (error) {
        console.error(`Failed to fetch page list: ${error}`)
      }
    }

    fetchPageList()
  }, [])

  return [pages, setPages]
}
