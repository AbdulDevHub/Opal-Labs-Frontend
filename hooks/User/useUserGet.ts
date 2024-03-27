import { useEffect, useState } from 'react'

import axios from 'axios'

export const useUserGet = (sessionToken: string | undefined) => {
  const [userData, setUserData] = useState<any>(null)

  // Running the effect whenever the session token changes
  useEffect(() => {
    // Asynchronous function to fetch user data
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_OPALESCENCE_BASE_URL}/user-get`,
          {
            withCredentials: true,
          }
        )
        console.log('Fetched User Data:', response.data)

        // Update the state with the fetched user data
        setUserData(response.data)
      } catch (error) {
        console.error(`Error: ${error}`)
      }
    }

    if (sessionToken) {
      fetchUserData()
    }
  }, [sessionToken])

  return userData
}
