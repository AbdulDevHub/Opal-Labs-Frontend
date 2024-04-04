import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

import MoreVertIcon from '@mui/icons-material/MoreVert'
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import AccountTypeDisplay from '@/components/DashboardComponents/AccountTypeDisplay'
import { usePageCreate } from '@/hooks/Page/usePageCreate'
import { usePageDelete } from '@/hooks/Page/usePageDelete'
import { usePageUpdate } from '@/hooks/Page/usePageUpdate'

type PageType = {
  page_uuid: string,
  page_name: string,
  is_root: boolean,
  element_positions: any[],
  public_page: boolean,
  page_uuid_url?: string,
  is_favourite?: boolean
}

// Meant as reference for top profile section of sidebar
type UserType = {
  google_id: string
  email: string
  name: string // Full first name & last name
  picture: string // User avatar image url
  status: string // ‘freemium’, ‘premium’, or ‘enterprise’
}

{/* PROPS TYPE VALUES FOR SIDEBAR COMPONENT */ }
type Props = {
  /** The current uuid that has been selected on the sidebar */
  selectedPageUuid: string
  /** For highlighting the selected page uuid */
  setSelectedPageUuid: (uuid: string) => void
  /** Toggle for whether or not dark mode is activated */
  isDarkMode: boolean
  /** Toggle for whether user has free, premium, or enterprise account */
  status: string
  /** Set the toggle for whether user has free, premium, or enterprise account */
  setStatus: (status: string) => void
  /** Toggle for whether or not the user is a free account */
  setIsUserBroke: (isBroke: boolean) => void
  /** Toggle for whether or not the sidebar is in favourite mode */
  isFavouriteFromSidebar: boolean
  /** Set the toggle for whether or not the sidebar is in favourite mode */
  setIsFavouriteFromSidebar: (isFavourite: boolean) => void
  /** The list of pages that have been fetched from the API */
  pages: PageType[]
  /** Set the list of pages that have been fetched from the API */
  setPages: (pages: PageType[]) => void
}

/**
 * Generate a Sidebar component with functionality for creating, deleting, renaming, and favoriting pages.
 *
 * @param {Props} props - the properties for the Sidebar component
 * @return {JSX.Element} the Sidebar component
 */
const Sidebar = (props: Props) => {
  {/* -------------------------- SIDEBAR STATES -----------------------*/ }
  // Sidebar Props
  const {
    pages, setPages,
    selectedPageUuid, setSelectedPageUuid,
    isDarkMode,
    status, setStatus, setIsUserBroke,
    isFavouriteFromSidebar, setIsFavouriteFromSidebar
  } = props

  // Page Endpoints
  const createPage = usePageCreate(pages, setPages, true)
  const updatePage = usePageUpdate()
  const deletePage = usePageDelete()

  // Add state for the anchor element of the menu (hide/show)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const open = Boolean(anchorEl)

  // Add state for renaming page
  const [editingPageUuid, setEditingPageUuid] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Get user's session data
  const session = useSession()

  // Use user's name and profile picture if they exist, otherwise use default values
  const userName = session.data?.user?.name || 'Opalescence'
  const userImage = session.data?.user?.image || '/images/opal.png'

  // Set image border radius and name text size based on whether user's image and name exist
  const imageBorderRadius = session.data?.user?.image ? '40%' : '0%'
  const nameTextSize = session.data?.user?.name ? '1rem' : '1.25rem'

  {/* -------------------------- SIDEBAR EFFECTS -----------------------*/ }
  {/* SET FOCUS ON INPUT WHEN EDITING PAGE NAME */ }
  useEffect(() => {
    if (editingPageUuid && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editingPageUuid])

  {/* -------------------------- SIDEBAR HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * Asynchronously handles the creation of a new page by calling the createPage function.
   * If a child page is successfully created, it sets the selected page UUID to the page UUID of the child page.
   *
   * @return {Promise<void>} A Promise that resolves when the function completes.
   */
  const handleNewPage = async () => {
    const childPage = await createPage()
    if (childPage) setSelectedPageUuid(childPage.page_uuid)
  }

  /**
   * Handles the click action based on the provided parameters.
   *
   * @param {React.MouseEvent<HTMLElement>} event - description of parameter
   * @param {string} page_uuid - description of parameter
   * @return {void} description of return value
   */
  const handleClick = (event: React.MouseEvent<HTMLElement>, page_uuid: string) => {
    setAnchorEl(event.currentTarget)
    setHoveredItem(page_uuid)
  }

  /**
   * Handles the close action based on the provided parameters.
   *
   * @param {string} action - The action to be performed ('Delete', 'Rename', or 'Favourite').
   * @param {string} page_uuid - The UUID of the page.
   * @param {boolean} [page_is_root] - (Optional) Indicates if the page is a root page.
   * @param {string} [page_name] - (Optional) The name of the page.
   * @param {boolean} [is_favourite] - (Optional) Indicates if the page is a favourite.
   * @return {void} This function does not return a value.
   */
  const handleClose = async (
    action: string,
    page_uuid: string,
    page_is_root?: boolean,
    page_name?: string,
    page_elements?: any[],
    is_favourite?: boolean,
    public_page?: boolean
  ) => {
    if (action === 'Delete') {
      deletePage(page_uuid)
      // Create this new var so selectedPageUuid is updated correctly b/c of async
      const newPages = pages.filter(page => page.page_uuid !== page_uuid)
      setPages(newPages)
      setSelectedPageUuid(newPages[0]?.page_uuid)

      // If pages is now empty, reload tab to retrieve welcome page from backend
      if (newPages.length === 0) window.location.reload()
    } else if (action === 'Rename') {
      setEditingPageUuid(page_uuid)
    } else if (action === 'Favourite' && page_name && page_is_root) {
      updatePage(page_uuid, page_name, page_is_root, page_elements, !is_favourite, public_page)
      setPages(pages.map(page => page.page_uuid === page_uuid ? { ...page, is_favourite: !is_favourite } : page))
      setIsFavouriteFromSidebar(!isFavouriteFromSidebar)
    }
    setAnchorEl(null)
  }

  {/* -------------------------- SIDEBAR RENDER -----------------------*/ }
  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer variant="permanent" anchor="left" sx={{
        width: 240, flexShrink: 0, '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: isDarkMode ? '#212121' : '#f5f5f5',
        },
      }}>
        {/*User Profile Section*/}
        <Box sx={{ display: 'flex', alignItems: 'center', padding: '10px' }}>
          <Image src={userImage} alt={userName + ' Logo'} width={50} height={50} style={{ borderRadius: imageBorderRadius }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <AccountTypeDisplay status={status} setStatus={setStatus} setIsUserBroke={setIsUserBroke} />
            <Typography variant="h6" sx={{ marginLeft: '20px', fontSize: nameTextSize, color: isDarkMode ? 'white' : 'black' }}>
              {userName}
            </Typography>
          </div>
        </Box>

        {/*Favourite Pages Section - Only show if there is at least one favourite pages*/}
        {pages.filter(page => page.is_favourite).length > 0 && (
          <>
            {/*----------------- Favourite Pages Section Header ----------------- */}
            <p style={{
              marginTop: '20px', marginBottom: '2px', marginLeft: '15px',
              fontSize: '0.85rem', color: isDarkMode ? 'white' : 'black',
              fontWeight: '500',
              display: 'flex', alignItems: 'center'
            }}><StarIcon fontSize="small" sx={{ marginRight: '10px' }} />FAVOURITES</p>

            {/*----------------- Favourite Pages List ----------------- */}
            <List>
              {pages.filter(page => page.is_favourite).map((page) => {
                const isSelected = selectedPageUuid === page.page_uuid
                const isHovered = hoveredItem === page.page_uuid
                const isRoot = page.is_root
                const isPublicPage = page.public_page

                return (
                  <ListItem
                    disablePadding
                    key={page.page_uuid}
                    onMouseEnter={() => setHoveredItem(page.page_uuid)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{ height: '50px' }}
                  >
                    <ListItemButton
                      onClick={() => setSelectedPageUuid(page.page_uuid)}
                      sx={{
                        backgroundColor: isSelected ? (isDarkMode ? 'rgba(25, 118, 210, 0.5)' : 'rgba(25, 118, 210, 0.12)') : 'transparent',
                        color: isDarkMode ? 'white' : 'black',
                        paddingLeft: '25px'
                      }}
                    >

                      {/*Logic to rename page*/}
                      <ListItemText primary={editingPageUuid === page.page_uuid ? (
                        <input
                          ref={inputRef}
                          type="text"
                          defaultValue={page.page_name}
                          onBlur={(e) => {
                            const newName = e.target.value.trim() === '' ? 'Untitled' : e.target.value
                            setPages(pages.map(page => page.page_uuid === editingPageUuid ? { ...page, page_name: newName } : page))
                            updatePage(editingPageUuid, newName, isRoot, undefined, isFavouriteFromSidebar, isPublicPage)
                            setEditingPageUuid(null)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.currentTarget.blur()
                            }
                          }}
                          style={{
                            outline: 'none',
                            border: 'none',
                            padding: '5px',
                            backgroundColor: 'transparent',
                          }}
                        />
                      ) : page.page_name} />

                      {/*Logic to show selected/hovered page menu*/}
                      {(isSelected || isHovered) && (
                        <IconButton onClick={(event) => { handleClick(event, page.page_uuid) }} size="small">
                          <MoreVertIcon sx={{ color: isDarkMode ? 'white' : 'black' }} />
                        </IconButton>
                      )}
                    </ListItemButton>

                    {/*Sidebar Sub-Menu*/}
                    <Menu
                      id={`simple-menu-${page.page_uuid}`}
                      anchorEl={anchorEl}
                      keepMounted
                      open={open && hoveredItem === page.page_uuid}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => handleClose('Delete', page.page_uuid)}>Delete</MenuItem>
                      <MenuItem onClick={() => handleClose('Rename', page.page_uuid)}>Rename</MenuItem>
                      <MenuItem onClick={() => handleClose('Favourite', page.page_uuid, page.is_root, page.page_name, undefined, page.is_favourite, page.public_page)}>
                        {page.is_favourite ? 'Unfavourite' : 'Favourite'}
                      </MenuItem>
                    </Menu>
                  </ListItem>
                )
              })}
            </List>
          </>
        )}


        {/* ----------------- All Pages Section Header -----------------*/}
        <p style={{
          marginTop: '20px', marginBottom: '2px', marginLeft: '15px',
          fontSize: '0.85rem', color: isDarkMode ? 'white' : 'black',
          fontWeight: '500'
        }}>PAGES</p>

        {/*----------------- All Pages List -----------------*/}
        <List>
          {pages.filter(page => page.is_root).map((page) => {
            {/*{pages.map((page) => { <= Uncomment this line if you want to see all of the pages (including hidden subpages)*/ }
            const isSelected = selectedPageUuid === page.page_uuid
            const isHovered = hoveredItem === page.page_uuid
            const isRoot = page.is_root
            const isPublicPage = page.public_page

            return (
              <ListItem
                disablePadding
                key={page.page_uuid}
                onMouseEnter={() => setHoveredItem(page.page_uuid)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{ height: '50px' }}
              >
                <ListItemButton
                  onClick={() => setSelectedPageUuid(page.page_uuid)}
                  sx={{
                    backgroundColor: isSelected ? (isDarkMode ? 'rgba(25, 118, 210, 0.5)' : 'rgba(25, 118, 210, 0.12)') : 'transparent',
                    color: isDarkMode ? 'white' : 'black',
                    paddingLeft: '25px'
                  }}
                >

                  {/*Logic to rename page*/}
                  <ListItemText primary={editingPageUuid === page.page_uuid ? (
                    <input
                      ref={inputRef}
                      type="text"
                      defaultValue={page.page_name}
                      onBlur={(e) => {
                        const newName = e.target.value.trim() === '' ? 'Untitled' : e.target.value
                        setPages(pages.map(page => page.page_uuid === editingPageUuid ? { ...page, page_name: newName } : page))
                        updatePage(editingPageUuid, newName, isRoot, undefined, isFavouriteFromSidebar, isPublicPage)
                        setEditingPageUuid(null)
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.currentTarget.blur()
                        }
                      }}
                      style={{
                        outline: 'none',
                        border: 'none',
                        padding: '5px',
                        backgroundColor: 'transparent',
                      }}
                    />
                  ) : page.page_name} />

                  {/*Logic to show selected/hovered page menu*/}
                  {(isSelected || isHovered) && (
                    <IconButton onClick={(event) => handleClick(event, page.page_uuid)} size="small">
                      <MoreVertIcon sx={{ color: isDarkMode ? 'white' : 'black' }} />
                    </IconButton>
                  )}
                </ListItemButton>

                {/*Sidebar Sub-Menu*/}
                <Menu
                  id={`simple-menu-${page.page_uuid}`}
                  anchorEl={anchorEl}
                  keepMounted
                  open={open && hoveredItem === page.page_uuid}
                  onClose={handleClose}
                >
                  <MenuItem onClick={() => handleClose('Delete', page.page_uuid)}>Delete</MenuItem>
                  <MenuItem onClick={() => handleClose('Rename', page.page_uuid)}>Rename</MenuItem>
                  <MenuItem onClick={() => handleClose('Favourite', page.page_uuid, page.is_root, page.page_name, undefined, page.is_favourite, page.public_page)}>
                    {page.is_favourite ? 'Unfavourite' : 'Favourite'}
                  </MenuItem>
                </Menu>
              </ListItem>
            )
          })}
        </List>

        {/*----------------- New Page Button -----------------*/}
        <Button onClick={handleNewPage} sx={{ position: 'sticky', bottom: '0', marginBottom: '30px', backgroundColor: isDarkMode ? '#212121' : '#f5f5f5' }}>+ New Page</Button>
      </Drawer>
    </Box>
  )
}

export default Sidebar