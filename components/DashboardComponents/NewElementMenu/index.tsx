import React, { useEffect, useState } from 'react'

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Button from '@mui/material/Button'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'

interface NewElementMenuProps {
  index: number
  isTopElement: boolean
  isEditable: boolean
  isDarkMode: boolean
  isComponentFocused?: boolean
  isDraggable: boolean
  handleSelectType: (type: string, index: number) => void
}

/**
 * Renders a new element menu component.
 *
 * @param {NewElementMenuProps} props - The props for the component.
 * @param {number} props.index - The index of the element.
 * @param {boolean} props.isTopElement - Indicates if the element is at the top.
 * @param {boolean} props.isEditable - Indicates if the element is editable.
 * @param {boolean} props.isDarkMode - Indicates if the element is in dark mode.
 * @param {boolean} props.isComponentFocused - Indicates if the element is focused.
 * @param {boolean} props.isDraggable - Indicates if the element is draggable.
 * @param {(type: string, index: number) => void} props.handleSelectType - The function to handle selecting a type.
 * @return {ReactElement} The rendered new element menu.
 */
const NewElementMenu: React.FC<NewElementMenuProps> = ({
  index,
  isTopElement,
  isEditable,
  isDarkMode,
  isComponentFocused,
  isDraggable,
  handleSelectType
}) => {
  {/* -------------------------- NEW ELEMENT MENU STATES -----------------------*/ }
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const [showButtons, setShowButtons] = useState<boolean>(false)

  // State to open/close the additional text menu options
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Convert "+ New Element" text to "+" because of responsive design
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0)

  {/* -------------------------- NEW ELEMENT MENU EFFECTS -----------------------*/ }
  {/* WHEN THE WINDOW RESIZES, CONVERT "+ New Element" TEXT TO "+" */ }
  useEffect(() => {
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  {/* -------------------------- NEW ELEMENT MENU HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * A function to handle window resize events.
   */
  const handleResize = () => { setWindowWidth(window.innerWidth) }

  /**
   * Handles the click event of a menu item.
   *
   * @param {string} type - The type of the menu item.
   * @return {void} No return value.
   */
  const handleMenuItemClick = (type: string) => {
    handleSelectType(type, index)
    setShowDropdown(false)
    setAnchorEl(null)
  }

  /**
   * A function that handles the click event on the text menu.
   *
   * @param {React.MouseEvent<HTMLElement>} event - the click event
   * @return {void} 
   */
  const handleTextMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  /**
   * A function to handle the closing of the text menu.
   */
  const handleTextMenuClose = () => {
    setAnchorEl(null)
  }

  /**
   * A description of the entire function.
   *
   */
  const handleClickAway = () => {
    setShowDropdown(false)
  }

  {/* -------------------------- NEW ELEMENT MENU RENDER -----------------------*/ }
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>

        {/* ------------------------ TOP NEW ELEMENT BUTTON -----------------------*/}
        {isTopElement && isEditable && (
          <Button onClick={() => setShowDropdown(!showDropdown)}>
            + New Element
          </Button>
        )}

        {/* ------------------------ BOTTOM NEW ELEMENT BUTTON - THE ONE THAT SHOWS/HIDES ON HOVER -----------------------*/}
        {!isTopElement && !isDraggable && (
          <div
            onMouseEnter={() => setShowButtons(true)}
            onMouseLeave={() => setShowButtons(false)}
            style={{
              height: '35px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            {(showButtons || showDropdown) && isEditable && (
              <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
                {/* Left Vertical Line */}
                <div style={{ width: '30%', height: '100%' }}>
                  <div style={{
                    width: '100%', height: '50%', margin: 'auto 0', borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.12)'
                  }}>
                  </div>
                </div>

                {/* Center Dropdown Button */}
                <Button
                  onClick={() => setShowDropdown(!showDropdown)}
                  style={{
                    borderRadius: '25px',
                    backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.12)',
                    color: 'rgba(0, 0, 0, 0.87)',
                    marginRight: '10px',
                    marginLeft: '10px',
                    height: '35px',
                  }}
                >
                  {windowWidth <= 914 ? '+' : '+ New Element'}
                </Button>

                {/* Right Vertical Line */}
                <div style={{ width: '30%', height: '100%' }}>
                  <div style={{
                    width: '100%', height: '50%', margin: 'auto 0', borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
                    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.12)'
                  }}>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ------------------------ DROPDOWN MENU SHARED BY BOTH BUTTONS -----------------------*/}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 999,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            background: '#fff',
            padding: '5px',
            borderRadius: '5px'
          }}>
            {/* ------------------------ TEXT MENU OPTION -----------------------*/}
            <MenuItem onClick={handleTextMenuClick} style={{ fontSize: '16px', padding: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Text
              <ArrowRightIcon />
            </MenuItem>

            {/* ------------------------ TEXT MENU DROPDOWN -----------------------*/}
            <Menu
              id="text-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleTextMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
              <MenuItem onClick={() => handleMenuItemClick('Heading 1')} style={{ fontSize: '16px', padding: '5px' }}>Heading 1</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('Heading 2')} style={{ fontSize: '16px', padding: '5px' }}>Heading 2</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('Heading 3')} style={{ fontSize: '16px', padding: '5px' }}>Heading 3</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('Paragraph')} style={{ fontSize: '16px', padding: '5px' }}>Paragraph</MenuItem>
              <MenuItem onClick={() => handleMenuItemClick('Checkbox')} style={{ fontSize: '16px', padding: '5px' }}>Checkbox</MenuItem>
            </Menu>

            {/* ------------------------ THE REMAINING ELEMENT OPTIONS -----------------------*/}
            <MenuItem onClick={() => handleMenuItemClick('Callout')} style={{ fontSize: '16px', padding: '5px' }}>Callout</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Code Block')} style={{ fontSize: '16px', padding: '5px' }}>Code Block</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('iFrame')} style={{ fontSize: '16px', padding: '5px' }}>Web Embed</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Nested Page')} style={{ fontSize: '16px', padding: '5px' }}>Nested Page</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('Page Analytics')} style={{ fontSize: '16px', padding: '5px' }}>Page Analytics</MenuItem>
          </div>
        )}
      </div>
    </ClickAwayListener >
  )
}

export default NewElementMenu