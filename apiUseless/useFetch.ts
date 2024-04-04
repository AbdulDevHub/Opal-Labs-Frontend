import { useCallback } from 'react'

const methodKeys = ['GET', 'POST'] as const
type Method = (typeof methodKeys)[number]

const baseURLKeys = ['BE', 'CUSTOM'] as const
type BaseURL = (typeof baseURLKeys)[number]

const OPAL_LABS_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

type Props = {
  method: Method
  base: BaseURL
  url: string
  body?: any
  isForm?: boolean
}

/**
 * Asynchronous function to make an API request and handle the response.
 *
 * @param {Props} props - The properties for the API request
 * @return {Promise<{ data: any; error: any; statusCode: any }>} The response data, error, and status code wrapped in a Promise
 */
const fetchHelper = async (props: Props): Promise<{ data: any; error: any; statusCode: any }> => {
  const { method, base, url, body, isForm = false } = props

  /**
   * Returns the API URL based on the given base.
   *
   * @return {string} The API URL.
   */
  const api = () => {
    switch (base) {
      case 'BE':
        return `${OPAL_LABS_BASE_URL}/${url}`
      default:
        return url
    }
  }

  const req = {
    ...(base !== 'CUSTOM' && {
      credentials: 'include' as RequestCredentials,
      mode: 'cors' as RequestMode,
    }),
    method,
    ...(method !== 'GET' && { body: isForm ? body : JSON.stringify({ ...body, ts: Date.now() }) }),
    headers: {
      ...(!isForm && { 'Content-Type': 'application/json' }),
    },
  }

  const resp = await fetch(api(), req)

  const response: { error: any; data: unknown; statusCode: any } = {
    error: { data: undefined },
    data: undefined,
    statusCode: resp.status,
  }

  if (resp.status >= 400) {
    const error = await resp.text()
    response.error.data = error ? JSON.parse(error) : {}
    throw { status: resp.status, err: response.error.data }
  } else {
    const data = await resp.json()
    response.data = data
  }
  return response
}

/** IMPORTANT: Do not use this directly, use useAPI */

/**
 * Returns a memoized version of the fetchHelper function wrapped in a useCallback hook.
 *
 * @param {Method} method - The HTTP method to be used in the fetch request.
 * @param {BaseURL} base - The base URL for the fetch request.
 * @param {string} url - The URL endpoint for the fetch request.
 * @param {Object} [body] - The request body to be sent with the fetch request.
 * @param {{ isForm: boolean }} [options] - An optional object containing the isForm property indicating if the request body is a form data.
 * @return {Promise<Response>} - A promise that resolves to the fetch response.
 * @throws {Error} - Throws an error if the fetch request fails.
 */
const useFetch = () => {
  return useCallback(
    async (
      method: Method,
      base: BaseURL,
      url: string,
      body?: Object,
      options?: { isForm: boolean }
    ) => {
      try {
        return await fetchHelper({
          method,
          base,
          url,
          body,
          isForm: options?.isForm,
        })
      } catch (error) {
        throw error
      }
    },
    []
  )
}

export type CustomFetch = ReturnType<typeof useFetch>

export default useFetch
