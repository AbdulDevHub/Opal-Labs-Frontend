import { getSession, signOut } from 'next-auth/react'

import type { DataSource, PageGetResult, StoredPage, UserResult } from './types'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL

let cachedToken: string | undefined

/**
 * Returns the backend session token stored in the NextAuth session (set in [...nextauth].ts).
 * Cached after the first lookup so every request doesn't refetch the session.
 */
const getToken = async (): Promise<string | undefined> => {
  if (!cachedToken) {
    const session = await getSession()
    cachedToken = session?.userToken
  }
  return cachedToken
}

/** Forget the cached token (on sign-out) */
export const clearRemoteToken = () => {
  cachedToken = undefined
}

/**
 * Calls the Go backend. The token is sent as an `Authorization: Bearer` header
 * because the frontend and backend live on different sites, so cookies are not shared.
 */
const backendFetch = async <T = unknown>(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown } = {}
): Promise<T> => {
  const token = await getToken()
  const headers: Record<string, string> = {}
  if (token) headers.Authorization = `Bearer ${token}`
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'

  const body = init.body !== undefined ? JSON.stringify(init.body) : undefined
  const response = await fetch(`${BACKEND_URL}${path}`, {
    method: init.method ?? 'GET',
    headers,
    body,
    // Lets a save started as the tab closes still reach the server (browsers cap keepalive bodies at 64 KB)
    keepalive: body !== undefined && body.length < 60000,
  })

  // The backend token expired (or is invalid) while the NextAuth session is still alive:
  // sign out so the user can log in again instead of seeing an empty dashboard
  if (response.status === 401 && token) {
    clearRemoteToken()
    signOut({ callbackUrl: '/' })
  }

  if (!response.ok) {
    throw new Error(`${init.method ?? 'GET'} ${path} failed with status ${response.status}`)
  }
  return (await response.json()) as T
}

/** Wakes the backend (free hosting sleeps when idle). Errors are ignored. */
export const pingBackend = () => {
  if (!BACKEND_URL) return
  fetch(`${BACKEND_URL}/health`).catch(() => {})
}

export const remoteDataSource: DataSource = {
  async listPages() {
    const data = await backendFetch<{ pages?: StoredPage[] }>('/page-list')
    return data.pages ?? []
  },
  getPage(pageUuid) {
    return backendFetch<PageGetResult>(`/page-get/${pageUuid}`)
  },
  async createPage(page) {
    await backendFetch('/page-create', { method: 'POST', body: page })
  },
  async updatePage(update) {
    await backendFetch('/page-update', { method: 'POST', body: update })
  },
  async deletePage(pageUuid) {
    await backendFetch('/page-delete', { method: 'POST', body: { page_uuid: pageUuid } })
  },
  getUser() {
    return backendFetch<UserResult>('/user-get')
  },
  async logout() {
    try {
      await backendFetch('/user-logout', { method: 'POST' })
    } finally {
      clearRemoteToken()
    }
  },
}
