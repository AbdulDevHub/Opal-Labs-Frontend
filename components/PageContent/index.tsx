import Image from 'next/image'
import { useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

import OpenWithIcon from '@mui/icons-material/OpenWith'
import SaveIcon from '@mui/icons-material/Save'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import ToggleEditSwitch from '@/components/DashboardComponents/ToggleEditSwitch'
import ToggleThemeSwitch from '@/components/DashboardComponents/ToggleThemeSwitch'
import AnalyticsChart from '@/components/OurWebsiteElements/AnalyticsChart'
import CalloutElement from '@/components/OurWebsiteElements/Callout'
import CheckBox from '@/components/OurWebsiteElements/CheckBox'
import CodeBlockElement from '@/components/OurWebsiteElements/CodeBlock'
import CustomTextField from '@/components/OurWebsiteElements/CustomTextField'
import IframeElement from '@/components/OurWebsiteElements/Iframe'
import NestedPageElement from '@/components/OurWebsiteElements/NestedPage'
import { usePageCreate } from '@/hooks/Page/usePageCreate'
import { usePageGet } from '@/hooks/Page/usePageGet'
import { usePageUpdate } from '@/hooks/Page/usePageUpdate'
import loadingGif from 'public/images/loader.gif'
import loadingGifDark from 'public/images/loaderNoBackground.gif'
import { v4 as uuidv4 } from 'uuid'

{/* PAGE TYPE VALUES PROVIDED BY BACKEND */ }
type PageType = {
  page_uuid: string,
  page_name: string,
  is_root: boolean,
  element_positions: any[],
  public_page: boolean,
  page_uuid_url?: string,
  is_favourite?: boolean
}

{/* PROPS TYPE VALUES PROVIDED BY REACT-DND  */ }
interface DraggableComponentProps {
  id: string
  children: React.ReactNode
  type: string
}

{/* PROPS TYPE VALUES PROVIDED BY REACT-DND */ }
interface DroppableComponentProps {
  id: string
  onDrop: (dragId: string, dropId: string) => void
  children: React.ReactNode
}

{/* PROPS TYPE VALUES FOR PAGE CONTENT COMPONENT */ }
interface PageContentProps {
  /** For displaying the page content of the selected page uuid */
  selectedPageUuid: string
  /** Toggle for whether or not edit mode is activated */
  isEditable: boolean
  /** Toggle for whether or not dark mode is activated */
  isDarkMode: boolean
  /** Toggle for whether or not the page is a favourite from the sidebar */
  isFavouriteFromSidebar: boolean
  /** Toggle for whether or not the user has freemium account */
  isUserBroke: boolean
  /** Handler for toggling edit mode */
  toggleEdit: () => void
  /** Handler for signing out */
  handleSignOut: () => void
  /** Handler for toggling dark mode */
  toggleTheme: () => void
  /** For highlighting the selected page uuid */
  setSelectedPageUuid: (uuid: string) => void
  /** The list of pages that have been fetched from the API */
  pages: PageType[]
  /** Set the list of pages that have been fetched from the API */
  setPages: (pages: PageType[]) => void
}

{/* -------------------------- PAGE CONTENT COMPONENT -----------------------*/ }
const PageContent = ({
  selectedPageUuid,
  isEditable,
  isDarkMode,
  isFavouriteFromSidebar,
  isUserBroke,
  toggleEdit,
  handleSignOut,
  toggleTheme,
  pages,
  setPages,
  setSelectedPageUuid
}: PageContentProps) => {
  {/* -------------------------- PAGE CONTENT STATES -----------------------*/ }
  // State To Manage Focused State So That We Can Hide/Show Top New Element Button
  const [isComponentFocused, setComponentFocused] = useState(false)
  // State To Manage Drag And Drop State
  const [isDraggable, setIsDraggable] = useState(false)
  // Add a new state for tracking loading status
  const [isLoading, setIsLoading] = useState(true)

  // Page Endpoints
  const updatePage = usePageUpdate()
  const createPage = usePageCreate(pages, setPages, false)
  const {
    pageTitle, setPageTitle,
    isRoot, dateViewCount,
    pageElements, setPageElements,
    isFavourited, setIsFavourited,
    isPublicPage, setIsPublicPage
  } = usePageGet(selectedPageUuid, setIsLoading)

  // States To Manage Breadcrumb Trail, Nested Elements, And Subpages
  const [breadcrumb, setBreadcrumb] = useState([{ page_uuid: selectedPageUuid, page_name: '' }]) // page_name not settable here b/c of async
  const [nestedElementDeleted, setNestedElementDeleted] = useState(false)

  {/* -------------------------- PAGE CONTENT EFFECTS -----------------------*/ }
  {/* UPDATE BREADCRUMB TRAIL WHEN STATES CHANGE */ }
  useEffect(() => {
    // If page_name is empty for first item in breadcrumb
    if (breadcrumb[0].page_name == '' ||
      // If page_name or page_uuid doesn't match breadcrumb for root page
      (breadcrumb.length == 1 && (breadcrumb[0].page_name != pageTitle || breadcrumb[0].page_uuid != selectedPageUuid)) ||
      // if is_root is true && breadcrumb length is not 1
      (pages.find((page) => page.page_uuid == selectedPageUuid)?.is_root && breadcrumb.length != 1)) {
      setBreadcrumb([{ page_uuid: selectedPageUuid, page_name: pageTitle }])
    }
  }, [pageTitle, selectedPageUuid, breadcrumb, pages])

  {/* WHEN NEWLY CREATED ELEMENT IS NESTED PAGE, SAVE CHANGES */ }
  useEffect(() => {
    const pageElementsLength = pageElements.length
    if (pageElementsLength > 0 && pageElements[pageElementsLength - 1].type == 'Nested Page') {
      saveChanges()
    }
  }, [pageElements]) // eslint-disable-line

  {/* WHEN NESTED ELEMENT DELETED, SAVE CHANGES */ }
  useEffect(() => {
    if (nestedElementDeleted) {
      saveChanges()
      setNestedElementDeleted(false)
    }
  }, [nestedElementDeleted]) // eslint-disable-line

  {/* WHEN IS EDITABLE IS FALSE, SET IS DRAGGABLE TO FALSE */ }
  useEffect(() => {
    if (!isEditable) {
      setIsDraggable(false)
    }
  }, [isEditable])

  {/* WHEN IS FAVOURITE FROM SIDEBAR CHANGES, UPDATE IS FAVOURITE STATE */ }
  useEffect(() => {
    setIsFavourited(isFavouriteFromSidebar)
  }, [isFavouriteFromSidebar, setIsFavourited])

  {/* -------------------------- PAGE CONTENT HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   *  Handler for adding new content element from new element menu
   *
   * @param {string} type - the type of element to be handled
   * @param {number} index - the index of the element to be handled
   * @return {Promise<void>} a promise that resolves when the selection is handled
   */
  const handleSelectType = async (type: string, index: number) => {
    let newContent: { type: string; content: string; elementStyling: string; element_uuid: string }
    let childPage
    const element_uuid = uuidv4()

    if (type == 'iFrame') {
      newContent = { type, content: '', elementStyling: '', element_uuid }
    } else if (type == 'Nested Page') {
      childPage = await createPage(selectedPageUuid)
      if (childPage) {
        newContent = { type, content: 'Untitled', elementStyling: childPage.page_uuid, element_uuid, }
      }
    } else if (type == 'Code Block' || type == 'Page Analytics' || type == 'Checkbox') {
      newContent = { type, content: '', elementStyling: '', element_uuid, }
    } else if (type == 'Callout') {
      newContent = { type, content: '', elementStyling: '💡', element_uuid }
    } else {
      newContent = { type, content: '', elementStyling: 'normal; autofocus; color: #000000;', element_uuid }
    }

    // Insert the new type of content element to pageElements
    setPageElements((prevState) => {
      const newState = [...prevState]
      // Insert newContent at (index + 1) and remove 0 items from array, 
      newState.splice((index + 1), 0, newContent)
      return newState
    })
  }

  /**
   * Deletes the content element at the specified index.
   *
   * @param {number} index - The index of the content element to be deleted.
   * @return {void} This function does not return a value.
   */
  const handleDeleteContent = (index: number) => {
    // Filter out the content element at the specified index
    setPageElements(pageElements.filter((_, i) => i !== index))
  }

  /**
   * Handler for moving content element up or down
   * 
   * @param {number} index - the current index
   * @param {number} moveBy - the amount to move by
   * @return {void}
   */
  const moveElement = (index: number, moveBy: number) => {
    // Calculate the new index
    const newIndex = index + moveBy

    // Check if the new index is within the bounds of the array
    if (newIndex < 0 || newIndex >= pageElements.length) {
      // If not, do nothing and return
      return
    }

    // Create a copy of the pageElements array
    const newPageElements = [...pageElements]

    // Remove the element from the old position and insert it at the new position
    newPageElements.splice(newIndex, 0, newPageElements.splice(index, 1)[0])

    // Update the pageElements state
    setPageElements(newPageElements)
  }

  /**
   * A function that navigates to a specific page based on the page UUID and page name.
   * Mainly meant for navigating to root and sub-pages, and updating breadcrumb trail.
   *
   * @param {string} pageUUID - the UUID of the page to navigate to
   * @param {string} pageName - the name of the page to navigate to
   * @return {void}
   */
  const navigateToPage = (pageUUID: string, pageName: string) => {
    const pageIndex = breadcrumb.findIndex((page) => page.page_uuid === pageUUID)

    if (pageIndex === -1) {
      // The page doesn't exist in the breadcrumb, add it
      setBreadcrumb([...breadcrumb, { page_uuid: pageUUID, page_name: pageName }])
    } else {
      // The page exists, remove it and all pages after it
      setBreadcrumb(breadcrumb.slice(0, pageIndex + 1))
    }

    // Set the selected page UUID
    setSelectedPageUuid(pageUUID)
  }

  /**
   * Toggles the favorite status of a page and updates the page data.
   *
   * @return {Promise<void>} - A promise that resolves when the page data is updated.
   */
  const handleFavoriteClick = async () => {
    setIsFavourited(!isFavourited)
    await updatePage(selectedPageUuid, pageTitle, isRoot, pageElements, !isFavourited, isPublicPage)
    setPages(pages.map(page => page.page_uuid === selectedPageUuid ? { ...page, is_favourite: !isFavourited } : page))
  }

  /**
   * Creates a draggable component that can be used to drag and drop elements.
   *
   * @param {DraggableComponentProps} props - The props for the draggable component.
   * @param {string} props.id - The unique identifier for the component.
   * @param {ReactNode} props.children - The content of the component.
   * @param {string} props.type - The type of the component.
   * @return {JSX.Element} The draggable component.
   */
  const DraggableComponent = ({ id, children, type }: DraggableComponentProps) => {
    const [{ isDragging }, drag] = useDrag({
      type,
      item: { id, type },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    })

    return (
      <div ref={drag} style={{ opacity: isDragging ? 0 : 1, cursor: isDragging ? 'grabbing' : 'grab' }}>
        {children}
      </div>
    )
  }

  /**
   * A React component that enables dropping items and triggers a callback on drop.
   *
   * @param {string} id - The id of the droppable component
   * @param {function} onDrop - The callback function to trigger on drop
   * @param {ReactNode} children - The child elements to render within the droppable component
   * @return {JSX.Element} The rendered droppable component
   */
  const DroppableComponent = ({ id, onDrop, children }: DroppableComponentProps) => {
    const [, drop] = useDrop({
      accept: 'yourType',
      drop: (item: any) => onDrop(item.id, id), // update state on drop
    })

    return <div ref={drop}>{children}</div>
  }

  /**
   * A function to handle the movement of an element from one position to another.
   * Mainly meant for the drag and drop functionality
   *
   * @param {string} dragId - the id of the element being dragged
   * @param {string} dropId - the id of the element being dropped onto
   * @return {void}
   */
  const handleMove = (dragId: string, dropId: string) => {
    const dragIndex = parseInt(dragId)
    const dropIndex = parseInt(dropId)

    if (dragIndex !== dropIndex) {
      const newPageElements = [...pageElements]
      const draggedElement = newPageElements[dragIndex]

      newPageElements.splice(dragIndex, 1)
      newPageElements.splice(dropIndex, 0, draggedElement)

      setPageElements(newPageElements)
    }
  }

  /**
   * Save changes if isEditable is true.
   *
   * @return {Promise<void>}
   */
  const saveChanges = async () => {
    // Check if isEditable is false
    if (!isEditable) return

    await updatePage(selectedPageUuid, pageTitle, isRoot, pageElements, isFavourited, isPublicPage)
    setPages(pages.map(page => page.page_uuid === selectedPageUuid ? { ...page, page_name: pageTitle, elements: pageElements } : page))
  }

  /**
   * A function that handles publishing a new page and alerting the user.
   *
   * @return {void} - This function does not return anything
   */
  const handlePublish = async () => {
    // Set publish status
    setIsPublicPage(!isPublicPage)
    await updatePage(selectedPageUuid, pageTitle, isRoot, pageElements, isFavourited, !isPublicPage)
    setPages(pages.map(page => page.page_uuid === selectedPageUuid ? { ...page, public_page: !isPublicPage } : page))

    // Check if user isn't a free account
    if (isUserBroke && !isPublicPage) return

    // Open the live page in a new tab
    window.open(`${process.env.NEXT_PUBLIC_SITE_URL}/live/${selectedPageUuid}`, '_blank')
  }

  {/* -------------------------- PAGE CONTENT RENDER -----------------------*/ }
  return (
    <div style={{ width: "100%" }}>
      {/* -------------------------- PAGE HEADER -----------------------*/}
      <header style={{
        position: 'sticky', top: '0', zIndex: '1', display: 'flex',
        backgroundColor: isDarkMode ? '#202020' : '#FAFAFA',
        width: '100%', padding: '10px 30px',
        justifyContent: 'space-between', margin: '0'
      }}>

        {/* Page Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {breadcrumb.map((page, index) => {
            // Only show the first page, second page, and the last page when there are 4 or more pages
            if (breadcrumb.length >= 4 && index !== 0 && index !== 1 && index !== breadcrumb.length - 1) {
              // If the index is 2 and there are more than 4 pages, show "..."
              if (index === 2) {
                return <span key="ellipsis">... / </span>
              }
              return null
            }

            return (
              <span key={page.page_uuid}>
                <button
                  onClick={() => navigateToPage(page.page_uuid, page.page_name)}
                  style={{ cursor: 'pointer', border: 'none', background: 'none', fontSize: '16px', color: isDarkMode ? 'white' : 'black' }}
                >
                  {page.page_name}
                </button>
                {index < breadcrumb.length - 1 && ' / '}
              </span>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Toggle Draggable State */}
          {isEditable && <OpenWithIcon onClick={() => setIsDraggable(!isDraggable)} sx={{ color: isDraggable ? (isDarkMode ? 'white' : 'black') : "grey", cursor: 'pointer' }} />}

          {/* Favourite Button */}
          <button onClick={handleFavoriteClick} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            {(isFavourited) ? <StarIcon style={{ color: 'yellow' }} /> : <StarBorderIcon style={{ color: isDarkMode ? 'white' : 'black' }} />}
          </button>

          {/* Toggle theme switch */}
          <ToggleThemeSwitch isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          {/* Toggle switch for toggling page edit */}
          <ToggleEditSwitch isDarkMode={isDarkMode} isEditable={isEditable} toggleEdit={toggleEdit} />

          {/* Save button */}
          {isEditable && <Button onClick={saveChanges} sx={{ border: '2px solid rgb(25, 118, 210)' }}>
            <SaveIcon fontSize='small' />
            Save
          </Button>}
          {/* Publish button */}
          {!isEditable && (
            <Button
              onClick={handlePublish}
              disabled={isUserBroke}
              sx={{
                border: '2px solid',
                borderColor: isUserBroke ? '#A9A9A9' : 'rgb(25, 118, 210)',
                backgroundColor: isUserBroke ? (isDarkMode ? 'azure' : 'inherit') : 'inherit'
              }}
            >
              {isPublicPage ? 'Unpublish' : 'Publish'}
            </Button>
          )}
          {/* Sign out button */}
          <Button onClick={handleSignOut} sx={{ border: '2px solid #FF5252', color: '#FF5252' }}>Sign Out</Button>
        </div>
      </header>

      {/* -------------------------- MAIN PAGE CONTENT -----------------------*/}
      <main style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isLoading ? 'center' : 'flex-start',
        width: '100%', margin: '0',
        backgroundColor: isDarkMode ? '#282828' : 'white'
      }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: isLoading ? 'center' : 'flex-start',
            alignItems: 'center',
            minHeight: '85vh', // 100vh - header height
            width: '70%', // Gives space to elements so they aren't right next to sidebar
            margin: '0',
            marginTop: '10px'
          }}
        >
          {/* Show loading gif when isLoading is true */}
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
              <Image src={isDarkMode ? loadingGifDark : loadingGif} alt="Loading..." />
            </div>
          ) : (
            // Render your page content when isLoading is false (complete)
            <>
              <div style={{ height: '50.25px', marginTop: '1rem' }}>
                {/* New Element Button: Hide this when toolbar is focused */}
                <NewElementMenu
                  index={pageElements.length - 1}
                  isTopElement={true}
                  isEditable={isEditable}
                  isDarkMode={isDarkMode}
                  isComponentFocused={isComponentFocused}
                  isDraggable={isDraggable}
                  handleSelectType={handleSelectType}
                />
              </div>

              {/* Page Title Textfield*/}
              <TextField
                variant="standard"
                placeholder="Untitled"
                fullWidth
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    // Override Color For Disabled TextField
                    '& .MuiInputBase-input.Mui-disabled': {
                      WebkitTextFillColor: isDarkMode ? 'white' : '#000000',
                    }
                  },
                  style: {
                    fontSize: '60px',
                    color: isDarkMode ? 'white' : 'black',
                    paddingLeft: '10px'
                  }
                }}
                style={{ marginBottom: '20px' }}
                disabled={!isEditable}
              />

              {/* Generated Page Elements/Widgets */}
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <DndProvider backend={HTML5Backend}>
                  {pageElements.map((item, index) => {
                    const renderElement = () => {
                      if (item.type === 'iFrame') {
                        return (
                          <IframeElement
                            key={index}
                            item={item}
                            index={index}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            pageElements={pageElements}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            setPageElements={setPageElements}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else if (item.type === 'Callout') {
                        return (
                          <CalloutElement
                            key={index}
                            item={item}
                            index={index}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            pageElements={pageElements}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            setPageElements={setPageElements}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else if (item.type === 'Code Block') {
                        return (
                          <CodeBlockElement
                            key={index}
                            item={item}
                            index={index}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            pageElements={pageElements}
                            setPageElements={setPageElements}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else if (item.type === 'Page Analytics') {
                        return (
                          <AnalyticsChart
                            key={index}
                            index={index}
                            isUserBroke={isUserBroke}
                            dateViewCount={dateViewCount}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else if (item.type === 'Nested Page') {
                        return (
                          <NestedPageElement
                            key={index}
                            index={index}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            subPageUUID={item.elementStyling}
                            navigateToPage={navigateToPage}
                            pages={pages}
                            setPages={setPages}
                            setNestedElementDeleted={setNestedElementDeleted}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else if (item.type === 'Checkbox') {
                        return (
                          <CheckBox
                            key={index}
                            item={item}
                            index={index}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            handleSelectType={handleSelectType}
                            pageElements={pageElements}
                            isEditable={isEditable}
                            isDarkMode={isDarkMode}
                            isDraggable={isDraggable}
                            setPageElements={setPageElements}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      } else {
                        return (
                          <CustomTextField
                            key={index}
                            item={item}
                            index={index}
                            pageElements={pageElements}
                            isEditable={isEditable}
                            isDraggable={isDraggable}
                            isDarkMode={isDarkMode}
                            handleDeleteContent={handleDeleteContent}
                            moveElement={moveElement}
                            setPageElements={setPageElements}
                            handleSelectType={handleSelectType}
                            setComponentFocused={setComponentFocused}
                          />
                        )
                      }
                    }

                    const element = renderElement()

                    if (isDraggable) {
                      return (
                        <DroppableComponent key={index} id={index.toString()} onDrop={handleMove}>
                          <DraggableComponent id={index.toString()} type="yourType">
                            <div>{element}</div>
                          </DraggableComponent>
                        </DroppableComponent>
                      )
                    } else {
                      return element
                    }
                  })}
                </DndProvider>
              </Box>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default PageContent