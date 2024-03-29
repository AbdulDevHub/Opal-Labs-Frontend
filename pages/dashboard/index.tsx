import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'

import Box from '@mui/material/Box'

import PageContent from '@/components/PageContent'
import Sidebar from '@/components/Sidebar'
import { usePageList } from '@/hooks/Page/usePageList'
import { useUserGet } from '@/hooks/User/useUserGet'
import { useUserLogout } from '@/hooks/User/useUserLogout'

/**
 * Renders the Dashboard component which displays the user dashboard.
 *
 * The Dashboard component represents the main dashboard interface of the application.
 * It includes functionality for managing selected pages, editability, dark mode, and user logout.
 * 
 * @return {JSX.Element} The rendered Dashboard component
 */
const Dashboard = () => {
  {/* -------------------------- DASHBOARD STATES -----------------------*/ }
  // Retrieve session data using next-auth/react's useSession hook
  const { data: session } = useSession()

  // State to manage selected page
  const [selectedPageUuid, setSelectedPageUuid] = useState('')

  // State to manage shared states between sidebar & page content
  const [isEditable, setIsEditable] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFavouriteFromSidebar, setIsFavouriteFromSidebar] = useState(false)
  const [status, setStatus] = useState('freemium')
  const [isUserBroke, setIsUserBroke] = useState(false)

  // Call page and user hooks
  const [pages, setPages] = usePageList()
  const logoutUser = useUserLogout()
  const userData = useUserGet(session?.userToken)

  {/* -------------------------- DASHBOARD EFFECTS -----------------------*/ }
  {/* SET COOKIE UNTIL THE BACKEND DOES IT ON THEIR OWN */ }
  useEffect(() => {
    // Set the cookie only if session?.userToken is not empty or undefined
    if (session?.userToken) {
      // Need to set `Authorization=; path=/; domain=${process.env.NEXT_PUBLIC_SITE_URL};`
      // for deployed version
      document.cookie = `Authorization=${session.userToken}; path=/`
    }
  }, [session])

  {/* SET SELECTED PAGE TO FIRST PAGE IN PAGE LIST WHEN DASHBOARDS LOADS FOR FIRST TIME */ }
  useEffect(() => {
    if (pages.length > 0 && !selectedPageUuid) {
      setSelectedPageUuid(pages[0].page_uuid)
    }
  }, [pages, selectedPageUuid])

  { /* SET STATUS STATE TO STATUS FROM USER DATA AFTER IT IS FETCHED FROM API */ }
  useEffect(() => {
    if (userData) {
      setStatus(userData.status)
      setIsUserBroke(userData.status === 'freemium')
    }
  }, [userData])

  {/* -------------------------- DASHBOARD HANDLERS/FUNCTIONS -----------------------*/ }

  /**
   * Handles the sign out process.
   *
   * @return {Promise<void>} A promise that resolves when the sign out process is complete.
   */
  const handleSignOut = async () => {
    // Call the logoutUser endpoint
    await logoutUser()

    // Delete the Authorization cookie <= This isn't working for some reason
    // Need to set `Authorization=; path=/; domain=${process.env.NEXT_PUBLIC_SITE_URL}; expires=Thu, 01 Jan 1970 00:00:00 GMT;`
    // for deployed version [IGNORE ALL OF THIS BECAUSE THE BACKEND DELETES THE COOKIE THEMSELVES]
    // document.cookie = `Authorization=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`

    // Redirect back to homepage
    signOut({ callbackUrl: '/' })
  }

  /**
   * Toggles the editable state of the component.
   *
   * @return {void} No return value.
   */
  const toggleEdit = () => {
    setIsEditable(!isEditable)
  }

  /**
   * Toggles the theme between light and dark mode.
   */
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  {/* -------------------------- DASHBOARD RENDER -----------------------*/ }
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>

      {/* -------------------------- SIDEBAR -----------------------*/}
      <Box sx={{ width: 240, flexShrink: 0 }}>
        <Sidebar
          pages={pages}
          setPages={setPages}
          selectedPageUuid={selectedPageUuid}
          setSelectedPageUuid={setSelectedPageUuid}
          isDarkMode={isDarkMode}
          status={status}
          setStatus={setStatus}
          setIsUserBroke={setIsUserBroke}
          isFavouriteFromSidebar={isFavouriteFromSidebar}
          setIsFavouriteFromSidebar={setIsFavouriteFromSidebar}
        />
      </Box>

      {/* -------------------------- PAGE CONTENT -----------------------*/}
      <div style={{
        flex: 1, justifyContent: 'flex-start', padding: 0,
        backgroundColor: isDarkMode ? '#282828' : 'white'
      }}>
        <PageContent
          selectedPageUuid={selectedPageUuid}
          isEditable={isEditable}
          isDarkMode={isDarkMode}
          isFavouriteFromSidebar={isFavouriteFromSidebar}
          isUserBroke={isUserBroke}
          toggleEdit={toggleEdit}
          handleSignOut={handleSignOut}
          toggleTheme={toggleTheme}
          pages={pages}
          setPages={setPages}
          setSelectedPageUuid={setSelectedPageUuid}
        />
      </div>
    </Box>
  )
}

export default Dashboard