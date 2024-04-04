import { useCallback } from 'react'

/**
 * Returns a callback function that logs out the user by making a POST request to the server.
 *
 * @return {Function} The logoutUser function.
 */
export const useUserLogout = () => {
  // useCallback hook to avoid unnecessary re-renders
  const logoutUser = useCallback(async () => {
    try {
      // Making a POST request to the server to log out the user
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user-logout`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout request failed')
      }

      console.log('User logged out successfully')
    } catch (error) {
      console.error(`Logout error: ${error}`)
    }
  }, [])

  return logoutUser
}
