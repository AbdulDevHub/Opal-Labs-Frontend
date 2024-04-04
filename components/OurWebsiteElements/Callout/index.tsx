import React, { useEffect, useRef, useState } from 'react'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextField from '@mui/material/TextField'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import CalloutToolbarElement from '@/components/Toolbar/Callout'
import styled from 'styled-components'

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

{/* PROPS TYPE VALUES FOR CALLOUT COMPONENT */ }
interface CalloutElementProps {
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
  left: 555px;
  background-color: ${props => props.isDarkMode ? '#212121' : 'white'};
  z-index: 1;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid ${props => props.isDarkMode ? 'white' : 'lightgray'};

  @media (max-width: 1920px) and (min-width: 870px) {
    left: calc(990px + ((100vw - 1920px) / 2));
  }

  @media (max-width: 870px) {
    left: 460px;
  }

  @media (max-width: 884px) {
    top: calc(90px + 25px);
  }
`;

/**
 * Renders a callout element with a toolbar and a text field.
 *
 * @param {CalloutElementProps} item - The item to render.
 * @param {number} index - The index of the item.
 * @param {Function} handleDeleteContent - The function to handle deleting content.
 * @param {Function} moveElement - The function to move the element.
 * @param {Function} handleSelectType - The function to handle selecting the type.
 * @param {Array} pageElements - The array of page elements.
 * @param {boolean} isEditable - Whether the element is editable.
 * @param {boolean} isDarkMode - Whether the element is in dark mode.
 * @param {boolean} isDraggable - Whether the element is draggable.
 * @param {Function} setPageElements - The function to set the page elements.
 * @param {Function} setComponentFocused - The function to set the component focus.
 * @return {JSX.Element} The rendered callout element.
 */
const CalloutElement: React.FC<CalloutElementProps> = ({
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
  {/* -------------------------- CALLOUT STATES -----------------------*/ }
  // State to show or hide options
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
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

  {/* Function to hide the picker if you click outside of it */ }
  React.useEffect(() => {
    // Function to hide the picker if you click outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker && event.target instanceof Element && !event.target.closest('.emoji-picker-react')) {
        // Add a delay to the execution of the function
        setTimeout(() => setShowEmojiPicker(false), 0)
      }
    }

    // Add the event listener when the picker is shown
    if (showEmojiPicker) {
      document.addEventListener('click', handleClickOutside)
    }

    // Remove the event listener when the picker is hidden
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [showEmojiPicker])

  {/* -------------------------- CALLOUT RENDER -----------------------*/ }
  return (
    <div style={{ width: "100%" }}>

      {/* TOOLBAR */}
      {(isFocused || showEmojiPicker) && !isDraggable && isEditable && (
        <StyledDiv isDarkMode={isDarkMode} ref={toolbarRef}>
          <CalloutToolbarElement
            index={index}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            isDarkMode={isDarkMode}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={(emoji) => {
              setShowEmojiPicker(false)
              // Use setPageElements to save emoji to elementStyling
              setPageElements((prevState) => {
                return prevState.map((item: Item, i: number) => {
                  if (i === index) {
                    return {
                      ...item,
                      elementStyling: `${emoji.emoji}`
                    }
                  }
                  return item
                })
              })
            }}
          />
        </StyledDiv>
      )}

      {/* CALLOUT COMPONENT */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
        <div ref={toolbarRef} style={{
          width: "100%",
          display: "flex",
          backgroundColor: isDarkMode ? "#424242" : "#F5F5F5",
          padding: " 10px",
          borderRadius: "5px",
          border: isFocused ? "2px solid #1976d2" : "2px solid transparent"
        }}>

          {/* CALLOUT EMOJI */}
          <p style={{ marginTop: "0px", marginBottom: "0px", marginRight: "10px", paddingTop: "3px" }}>
            {item.elementStyling}
          </p>

          {/* CALLOUT TEXT */}
          <TextField
            ref={toolbarRef}
            value={item.content}
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
            fullWidth
            multiline
            variant="standard"
            disabled={(!isEditable || isDraggable)}
            InputProps={{
              disableUnderline: true,
              sx: {
                // Override Color For Disabled TextField
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: isDarkMode ? 'white' : '#000000',
                },
              },
              style: {
                color: isDarkMode ? "white" : "black",
              }
            }}
            onClick={() => { setIsFocused(true); setComponentFocused(true); }}
          />
        </div>

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
    </div >
  )
}

export default CalloutElement