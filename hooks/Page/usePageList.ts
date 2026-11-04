import { useEffect, useState } from 'react'

import { getDataSource } from '@/lib/data/mode'
import { v4 as uuidv4 } from 'uuid'

export type PageType = {
  page_uuid: string
  page_name: string
  is_root: boolean
  element_positions: any[]
  public_page: boolean
  page_uuid_url?: string
  is_favourite?: boolean
  parent_page_uuid?: string | null
  last_updated_at?: string
  view_count?: number
  etc?: Record<string, unknown> | null
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
        const dataSource = getDataSource()
        const fetchedPages = await dataSource.listPages()

        if (fetchedPages.length > 0) {
          setPages(fetchedPages as PageType[])
          return
        }

        // Otherwise create an empty page if page list is empty
        await dataSource.createPage({
          page_uuid: uuidv4(),
          page_name: 'Untitled',
          is_root: true,
          element_positions: [],
          public_page: false,
          is_favourite: false,
          etc: null,
        })
        setPages((await dataSource.listPages()) as PageType[])
      } catch (error) {
        console.error(`Failed to fetch page list: ${error}`)
      }
    }

    fetchPageList()
  }, [])

  return [pages, setPages]
}
