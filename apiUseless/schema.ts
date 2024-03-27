import { APITemplate } from '@/apiUseless/types'
import { CustomFetch } from '@/apiUseless/useFetch'
// For Page List and Page Get
import {
  Page,
  PageCreateReq,
  PageDeleteReq,
  PageGetReq,
  PageGetResp,
  PageListResp,
  PageUpdateReq,
} from '@/types/Page&Elements'
import { UserGetResp } from '@/types/User'

/**
 * Generates a configuration object for the API template using the provided custom fetch function.
 *
 * @param {CustomFetch} customFetch - The custom fetch function to be used for API requests.
 * @return {APITemplate} The configuration object for the API template.
 */
export const config = (customFetch: CustomFetch) =>
  ({
    ...pages(customFetch),
    ...users(customFetch),
    ..._(),
    ...hi(),
    ...hello(),
  } as const satisfies APITemplate)

/**
 * Generates a set of functions for interacting with pages.
 *
 * @param {CustomFetch} customFetch - The custom fetch function.
 * @return {Object} An object containing functions for page deletion, update, creation, listing, and retrieval.
 */
const pages = (customFetch: CustomFetch) =>
  ({
    pageDelete: async (args: PageDeleteReq) => {
      const res = await customFetch('POST', 'BE', '/page-delete', args)
      return res.data as { page_uuid: string }
    },
    pageUpdate: async (args: PageUpdateReq) => {
      const res = await customFetch('POST', 'BE', '/page-update', args)
      return res.data as { page_uuid: string }
    },
    pageCreate: async (args: PageCreateReq) => {
      const res = await customFetch('POST', 'BE', '/page-create', args)
      return res.data as { page_uuid: string }
    },
    pageList: async () => {
      const res = await customFetch('GET', 'BE', '/page-list')
      return res.data as { pages: Page[] }
    },
    pageGet: async (args: PageGetReq) => {
      const res = await customFetch('GET', 'BE', '/page-get', args)
      //const res = await customFetch('GET', 'BE', `/page-get/${args.page_uuid}`)
      return res.data as PageGetResp
    },
  } as const)

/**
 * Returns an object with a single method `userGet` that makes a GET request to the `/user-get` endpoint
 * using the provided `customFetch` function. The response is expected to be of type `UserGetResp`.
 *
 * @param {CustomFetch} customFetch - The custom fetch function to use for making the GET request.
 * @return {Promise<{ userGet: () => Promise<UserGetResp> }>} - An object with a single method `userGet`
 * that returns a promise resolving to the response data of type `UserGetResp`.
 */
const users = (customFetch: CustomFetch) =>
  ({
    userGet: async () => {
      const res = await customFetch('GET', 'BE', '/user-get')
      return res.data as UserGetResp
    },
  } as const)

// Mock Data Response for Development
const _ = () =>
  ({
    mockUserGet: async () => {
      function getUserWithTimeout(): Promise<UserGetResp> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              user: {
                id: 123,
              },
            })
          }, 200)
        })
      }

      const user = await getUserWithTimeout()
      return user
    },
  } as const)

// Mock for Page Get
const hi = () =>
  ({
    mockPageGet: async (page_uuid: string) => {
      function getPageWithTimeout(page_uuid: string): Promise<PageGetResp> {
        return new Promise((resolve) => {
          setTimeout(() => {
            if (page_uuid === 'uuid-1') {
              resolve({
                page: {
                  page_uuid: 'uuid-1',
                  page_name: 'Overview Page',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/overview',
                },
                elements: [
                  {
                    element_uuid: 'element1',
                    type: 'text',
                    content: { text: 'Welcome to Overview Page!' },
                    etc: {
                      color: 'green',
                      background_color: 'white',
                      italics: true,
                    },
                    size: 'large',
                  },
                ],
              })
            } else if (page_uuid === 'uuid-2') {
              resolve({
                page: {
                  page_uuid: 'uuid-2',
                  page_name: 'Profile Page',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/profile',
                },
                elements: [
                  {
                    element_uuid: 'element2',
                    type: 'text',
                    content: { text: 'Welcome to the Profile Page!' },
                    etc: {
                      color: 'blue',
                      background_color: 'lightgrey',
                      italics: false,
                    },
                    size: 'medium',
                  },
                ],
              })
            } else if (page_uuid === 'uuid-3') {
              resolve({
                page: {
                  page_uuid: 'uuid-3',
                  page_name: 'Settings Page',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/settings',
                },
                elements: [
                  {
                    element_uuid: 'element3',
                    type: 'text',
                    content: { text: 'Welcome to the Settings Page!' },
                    etc: {
                      color: 'red',
                      background_color: 'lightgrey',
                      italics: false,
                    },
                    size: 'medium',
                  },
                ],
              })
            }
          }, 200)
        })
      }
      const page = await getPageWithTimeout(page_uuid)
      return page
    },
  } as const)

// Mock for Page List
const hello = () =>
  ({
    mockPageList: async () => {
      function listPageWithTimeout(): Promise<PageListResp> {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve({
              pages: [
                {
                  page_uuid: 'uuid-1',
                  page_name: 'Overview',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/overviewPage',
                },
                {
                  page_uuid: 'uuid-2',
                  page_name: 'Profile',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/settingsPage',
                },

                {
                  page_uuid: 'uuid-3',
                  page_name: 'Settings',
                  is_root: false,
                  element_positions: [],
                  public_page: true,
                  page_uuid_url: '/dashboard/profilePage',
                },
              ],
            })
          }, 200)
        })
      }

      const page = await listPageWithTimeout()
      return page
    },
  } as const)
