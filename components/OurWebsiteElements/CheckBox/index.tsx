import React, { useEffect, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import CheckboxToolbarElement from '@/components/Toolbar/Checkbox'
import styled from 'styled-components'

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

{/* PROPS TYPE VALUES FOR CHECKBOX COMPONENT */ }
interface CheckBoxProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
  pageElements: { type: string; content: string; elementStyling: string; element_uuid: string }[]
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
  setPageElements: (value: Item[] | ((prevState: Item[]) => Item[])) => void
  setComponentFocused: (isFocused: boolean) => void
}

{/* POSITION THE TOOLBAR TO THE TOP OF THE SCREEN */ }
type StyledDivProps = {
  isDarkMode: boolean;
};

const StyledDiv = styled.div<StyledDivProps>`
  position: fixed;
  top: 90px;
  left: 574px;
  background-color: ${props => props.isDarkMode ? '#212121' : 'white'};
  z-index: 1;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid ${props => props.isDarkMode ? 'white' : 'lightgray'};

  @media (max-width: 1920px) and (min-width: 870px) {
    left: calc(1009px + ((100vw - 1920px) / 2));
  }

  @media (max-width: 870px) {
    left: 483px;
  }

  @media (max-width: 884px) {
    top: calc(90px + 25px);
  }
`;

/**
 * Renders a checkbox component with options for editing, deleting, and selecting other types.
 *
 * @param {CheckBoxProps} props - The props object containing the following properties:
 *   - item: The checkbox item.
 *   - index: The index of the checkbox item.
 *   - handleDeleteContent: The function to handle deleting the checkbox item.
 *   - moveElement: The function to move the checkbox item.
 *   - handleSelectType: The function to handle selecting a different type for the checkbox item.
 *   - pageElements: The array of page elements.
 *   - isEditable: A boolean indicating if the checkbox is editable.
 *   - isDarkMode: A boolean indicating if the checkbox is in dark mode.
 *   - isDraggable: A boolean indicating if the checkbox is draggable.
 *   - setPageElements: The function to set the page elements.
 *   - setComponentFocused: The function to set the focused component.
 * @return {JSX.Element} The rendered checkbox component.
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  item,
  index,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  pageElements,
  isEditable,
  isDarkMode,
  isDraggable,
  setPageElements,
  setComponentFocused
}) => {
  {/* -------------------------- CHECKBOX STATES -----------------------*/ }
  // State to show or hide options
  const [isFocused, setIsFocused] = useState(false)

  {/* -------------------------- CALLOUT EFFECTS -----------------------*/ }
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

  {/* -------------------------- CHECKBOX HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * Updates the page elements by toggling the 'elementStyling' property of the item at the specified index.
   *
   * @param {number} index - The index of the item to be updated.
   * @return {void} This function does not return a value.
   */
  const handleChecked = (index: number) => {
    if (!isEditable || isDraggable) return

    setPageElements((prevState) => {
      return prevState.map((item: Item, i: number) => {
        if (i === index) {
          return {
            ...item,
            elementStyling: item.elementStyling === 'checked' ? '' : 'checked'
          }
        }
        return item
      })
    })
  }

  {/* -------------------------- CHECKBOX RENDER -----------------------*/ }
  return (
    <>
      {/* TOOLBAR */}
      {(isFocused) && !isDraggable && isEditable && (
        <StyledDiv isDarkMode={isDarkMode} ref={toolbarRef}>
          <CheckboxToolbarElement
            index={index}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            isDarkMode={isDarkMode}
          />
        </StyledDiv>
      )}

      {/* CHECKBOX COMPONENT */}
      <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '20px' }}>
        <Checkbox
          checked={item.elementStyling === 'checked'}
          onChange={() => { handleChecked(index) }}
          sx={{
            color: isDarkMode ? '#ffffff' : '#000000',
            '&.Mui-checked': {
              color: isDarkMode ? '#ffffff' : '#000000',
            },
          }}
        />
        <TextField
          ref={toolbarRef}
          value={item.content}
          multiline
          onChange={(e) => {
            const updatedContent = {
              ...item,
              content: e.target.value,
              ...(item.element_uuid ? { element_uuid: item.element_uuid } : {})
            }
            setPageElements([
              ...pageElements.slice(0, index),
              updatedContent,
              ...pageElements.slice(index + 1)
            ])
          }}
          variant="outlined"
          size="small"
          fullWidth
          disabled={(!isEditable || isDraggable)}
          InputProps={{
            disableUnderline: true,
            sx: {
              // Override Color For Disabled TextField
              '& .MuiInputBase-input.Mui-disabled': {
                WebkitTextFillColor: isDarkMode ? '#ffffff' : '#000000',
              },
              // Change disabled outline color to white
              '&.Mui-disabled': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: isDarkMode ? '#ffffff' : '#000000',
                },
              },
              // Change outline color to white
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: isDarkMode ? '#ffffff' : '#000000',
              }
            },
            style: {
              color: isDarkMode ? '#ffffff' : '#000000'
            }
          }}
          onClick={() => { setIsFocused(true); setComponentFocused(true); }}
        />

        {/* QUICK ADD & DELETE BUTTONS */}
        {!isDraggable && isEditable && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => handleSelectType('Checkbox', index)}>
              <AddIcon fontSize="small" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            </IconButton>

            <IconButton onClick={() => handleDeleteContent(index)}>
              <CloseIcon fontSize="small" sx={{ color: isDarkMode ? '#ffffff' : '#000000' }} />
            </IconButton>
          </div>
        )}

        {isDraggable && isEditable && <DragIndicatorIcon />}
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
    </>
  )
}

export default CheckBox