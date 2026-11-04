import { useCallback } from 'react'

import { getDataSource } from '@/lib/data/mode'

/**
 * Returns a callback function that logs out the user.
 *
 * @return {Function} The logoutUser function.
 */
export const useUserLogout = () => {
  const logoutUser = useCallback(async () => {
    try {
      await getDataSource().logout()
    } catch (error) {
      console.error(`Logout error: ${error}`)
    }
  }, [])

  return logoutUser
}
