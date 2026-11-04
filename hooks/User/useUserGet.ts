import { useEffect, useState } from 'react'

import { getDataSource, isGuest } from '@/lib/data/mode'
import type { UserResult } from '@/lib/data/types'

/**
 * Fetches the current user's data (account status, name, picture).
 * Runs once a backend session token exists, or straight away in guest mode.
 *
 * @param {string | undefined} sessionToken - The backend token from the NextAuth session
 * @return {UserResult | null} The user data, or null until it has loaded
 */
export const useUserGet = (sessionToken: string | undefined) => {
  const [userData, setUserData] = useState<UserResult | null>(null)

  useEffect(() => {
    if (!sessionToken && !isGuest()) return

    getDataSource()
      .getUser()
      .then(setUserData)
      .catch((error) => console.error(`Failed to fetch user data: ${error}`))
  }, [sessionToken])

  return userData
}
