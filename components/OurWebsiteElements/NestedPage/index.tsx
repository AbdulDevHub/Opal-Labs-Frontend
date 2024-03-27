import React, { useEffect, useRef, useState } from 'react'

import DescriptionIcon from '@mui/icons-material/Description'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import NestedPageToolbarElement from '@/components/Toolbar/NestedPage'
import { usePageDelete } from '@/hooks/Page/usePageDelete'
import styled from 'styled-components'

{/* PAGE TYPE VALUES PROVIDED BY BACKEND */ }
type PageType = {
  page_uuid: string,
  page_name: string,
  is_root: boolean,
  element_positions: any[],
  public_page: boolean,
  page_uuid_url?: string,
}

{/* PROPS TYPE VALUES FOR NESTED PAGE COMPONENT */ }
interface NestedPageElementProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
  subPageUUID: string
  navigateToPage: (pageUUID: string, pageName: string) => void
  pages: PageType[]
  setPages: (pages: PageType[]) => void
  setNestedElementDeleted: (value: boolean) => void
  setComponentFocused: (isFocused: boolean) => void
}

/**
 * Renders a nested page element component.
 *
 * @param {NestedPageElementProps} props - The props object containing the following properties:
 *   - index: The index of the nested page element.
 *   - handleDeleteContent: The function to handle deleting content.
 *   - moveElement: The function to move the element.
 *   - handleSelectType: The function to handle selecting a type.
 *   - isEditable: A boolean indicating whether the element is editable.
 *   - isDarkMode: A boolean indicating whether the element is in dark mode.
 *   - isDraggable: A boolean indicating whether the element is draggable.
 *   - subPageUUID: The UUID of the page.
 *   - navigateToPage: The function to navigate to a page.
 *   - pages: The array of pages.
 *   - setPages: The function to set the pages.
 *   - setNestedElementDeleted: The function to set the nested element as deleted.
 *   - setComponentFocused: The function to set the component as focused.
 * @return {ReactElement} The rendered nested page element component.
 */
const NestedPageElement: React.FC<NestedPageElementProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  isEditable,
  isDarkMode,
  isDraggable,
  subPageUUID,
  navigateToPage,
  pages,
  setPages,
  setNestedElementDeleted,
  setComponentFocused
}) => {
  {/* -------------------------- NESTED PAGE STATES -----------------------*/ }
  // Page Endpoint
  const deletePage = usePageDelete()

  // Find the current page using the pageUUID
  const currentPage = pages.find(page => page.page_uuid === subPageUUID)
  const currentPageName = currentPage ? currentPage.page_name : ''

  // State to determine whether to hide/show nested page toolbar
  const [isFocused, setIsFocused] = useState(false)

  // Div to position the toolbar on the top of the screen
  const StyledDiv = styled.div`
    position: fixed;
    top: 90px;
    left: 574px;
    background-color: ${isDarkMode ? '#212121' : 'white'};
    z-index: 1;
    padding: 15px;
    border-radius: 5px;
    border: 1px solid ${isDarkMode ? 'white' : 'lightgray'};

    @media (max-width: 1920px) and (min-width: 870px) {
      left: calc(1009px + ((100vw - 1920px) / 2));
    }

    @media (max-width: 870px) {
      left: 483px;
    }

    @media (max-width: 928px) {
      top: calc(90px + 25px);
    }
`;

  {/* -------------------------- NESTED PAGE EFFECTS -----------------------*/ }
  // Inside your component
  const toolbarRef = useRef<HTMLDivElement>(null);

  {/* Function to hide the toolbar if you click outside of it or the element */ }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setIsFocused(false)
        setComponentFocused(false)
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [setComponentFocused, toolbarRef])

  {/* -------------------------- NESTED PAGE HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * Deletes a nested page and its corresponding element.
   *
   * @return {void} This function does not return anything.
   */
  const deleteNestedPageAndElement = () => {
    handleDeleteContent(index)
    deletePage(subPageUUID)
    setPages(pages.filter(page => page.page_uuid !== subPageUUID))
    setNestedElementDeleted(true)
    setIsFocused(false)
    setComponentFocused(false)
  }

  {/* -------------------------- NESTED PAGE RENDER -----------------------*/ }
  return (
    <div id={`nested-page-${index}`} style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
      {/* TOOLBAR */}
      {(isFocused) && isEditable && !isDraggable && (
        <StyledDiv ref={toolbarRef}>
          <NestedPageToolbarElement
            index={index}
            isDarkMode={isDarkMode}
            deleteNestedPageAndElement={deleteNestedPageAndElement}
            moveElement={moveElement}
          />
        </StyledDiv>
      )}

      {/* NESTED PAGE COMPONENT */}
      <div
        ref={toolbarRef}
        onClick={() => { setIsFocused(!isFocused); setComponentFocused(!isFocused) }}
        onDoubleClick={() => navigateToPage(subPageUUID, currentPageName)}
        style={{ display: "inline-flex", alignItems: "center", padding: "5px 20px", cursor: "pointer", color: isDarkMode ? 'white' : 'black' }}>
        <DescriptionIcon style={{ marginRight: "10px", color: isDarkMode ? 'white' : 'black' }} />
        <p>{currentPageName}</p>
      </div>

      {/* NEW ELEMENT MENU */}
      <NewElementMenu
        index={index}
        isTopElement={false}
        isEditable={isEditable}
        isDarkMode={isDarkMode}
        isDraggable={isDraggable}
        handleSelectType={handleSelectType}
      />
    </div>
  )
}

export default NestedPageElement