import { guestDataSource } from './guest'
import { remoteDataSource } from './remote'
import type { DataSource } from './types'

/**
 * Guest mode lets visitors use the app without Google sign-in.
 * The flag lives in localStorage; pages are stored by the guest data source.
 */

const MODE_KEY = 'opal-mode'

export const isGuest = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(MODE_KEY) === 'guest'
  } catch {
    return false
  }
}

export const enterGuest = () => {
  try {
    window.localStorage.setItem(MODE_KEY, 'guest')
  } catch {
    // storage blocked: guest pages will only last for this tab
  }
}

export const exitGuest = () => {
  try {
    window.localStorage.removeItem(MODE_KEY)
  } catch {
    // nothing to remove
  }
}

/** Picks where data is read from and written to */
export const getDataSource = (): DataSource => (isGuest() ? guestDataSource : remoteDataSource)
