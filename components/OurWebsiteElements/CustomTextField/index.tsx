import { useEffect, useRef, useState } from 'react'

import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import TextField from '@mui/material/TextField'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import CustomTextFieldToolbar from '@/components/Toolbar/CustomTextField'
import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

{/* PROPS TYPE VALUES FOR CUSTOM TEXT FIELD COMPONENT */ }
interface CustomTextFieldProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  index: number
  pageElements: { type: string; content: string; elementStyling: string; element_uuid: string }[]
  isEditable: boolean
  isDraggable: boolean
  isDarkMode: boolean
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
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
  left: 385px;
  background-color: ${props => props.isDarkMode ? '#212121' : 'white'};
  z-index: 1;
  padding: 15px;
  border-radius: 5px;
  border: 1px solid ${props => props.isDarkMode ? 'white' : 'lightgray'};

  @media (max-width: 1920px) and (min-width: 753px) {
    left: calc(837px + ((100vw - 1920px) / 2));
  }

  @media (max-width: 753px) {
    left: 257px;
  }

  @media (max-width: 884px) {
    top: calc(90px + 25px);
  }
`;

/**
 * Generates the custom text field component with various styling and editing options.
 *
 * @param {CustomTextFieldProps} item - The properties for the custom text field
 * @param {number} index - The index of the custom text field
 * @param {Array<Item>} pageElements - The array of page elements
 * @param {boolean} isEditable - Flag indicating if the text field is editable
 * @param {boolean} isDraggable - Flag indicating if the text field is draggable
 * @param {boolean} isDarkMode - Flag indicating if dark mode is enabled
 * @param {Function} handleDeleteContent - Function to handle deleting content
 * @param {Function} moveElement - Function to move the element
 * @param {Function} handleSelectType - Function to handle selecting element type
 * @param {Function} setPageElements - Function to set page elements
 * @param {Function} setComponentFocused - Function to set the focus on the component
 * @return {JSX.Element} The custom text field component
 */
const CustomTextField: React.FC<CustomTextFieldProps> = ({
  item,
  index,
  pageElements,
  isEditable,
  isDraggable,
  isDarkMode,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  setPageElements,
  setComponentFocused
}) => {
  {/* -------------------------- CUSTOM TEXT FIELD STATES -----------------------*/ }
  // Generate a uuid
  const uuid = item.element_uuid || uuidv4()

  // States to hide/show options
  const [isCustomTextFieldFocused, setCustomTextFieldFocused] = useState(false)
  const [isSelectOpen, setIsSelectOpen] = useState(false)

  // States for text color and text highlight options
  const [showTextColorOptions, setShowTextColorOptions] = useState(false)
  const [showTextHighlightOptions, setShowTextHighlightOptions] = useState(false)
  const [activeTextColor, setActiveTextColor] = useState("#212121")
  const [activeTextHighlightColor, setActiveTextHighlightColor] = useState("transparent")

  // States for text styles
  const [isBold, setIsBold] = useState(false)
  const [isItalic, setIsItalic] = useState(false)
  const [isUnderline, setIsUnderline] = useState(false)

  {/* -------------------------- CUSTOM TEXT FIELD EFFECTS -----------------------*/ }
  // Inside your component
  const toolbarRef = useRef<HTMLDivElement>(null)

  {/* Function to hide the toolbar if you click outside of it or the element */ }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setCustomTextFieldFocused(false)
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

  {/* -------------------------- CUSTOM TEXT FIELD HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * Updates the type of a page element at the specified index (H1, H2, H3, P).
   *
   * @param {string} type - The new type to set for the page element.
   * @param {number} index - The index of the page element to update.
   * @return {void} This function does not return anything.
   */
  const handleTypeChange = (type: string, index: number) => {
    setPageElements((prevState) => {
      return prevState.map((item: Item, i: number) => {
        if (i === index) {
          return {
            ...item,
            type: type,
          }
        }
        return item
      })
    })
  }

  /**
   * Updates the text color of a specific element in the page elements array.
   *
   * @param {string} color - the new color value
   * @param {number} index - the index of the element to update
   * @return {void}
   */
  const handleTextColorChange = (color: string, index: number) => {
    setPageElements((prevState) => {
      return prevState.map((item: Item, i: number) => {
        if (i === index) {
          return {
            ...item,
            // Update the elementStyling with the new color
            elementStyling: `color: ${color}; ${item.elementStyling}`,
          }
        }
        return item
      })
    })
  }

  /**
   * Updates the background color of a page element at the specified index.
   *
   * @param {string} color - The new background color.
   * @param {number} index - The index of the page element to update.
   * @return {void} This function does not return a value.
   */
  const handleTextHighlightChange = (color: string, index: number) => {
    setPageElements((prevState) => {
      return prevState.map((item: Item, i: number) => {
        if (i === index) {
          return {
            ...item,
            elementStyling: item.elementStyling.includes('background-color')
              ? item.elementStyling.replace(/background-color:[^;]*/, `background-color: ${color}`)
              : `${item.elementStyling}; background-color: ${color}`,
          }
        }
        return item
      })
    })
  }

  /**
   * Updates the element styling of a page element at a given index based on the provided style.
   *
   * @param {string} style - The style to be applied to the element.
   * @param {number} index - The index of the page element to be updated.
   * @return {void} This function does not return anything.
   */
  const handleStyleChange = (style: string, index: number) => {
    setPageElements((prevState) => {
      return prevState.map((item, i: number) => {
        if (i === index) {
          return {
            ...item,
            elementStyling:
              item.elementStyling === style
                ? 'normal'
                : item.elementStyling.includes(style)
                  ? item.elementStyling.replace(style, '')
                  : item.elementStyling + ' ' + style,
          }
        }
        return item
      })
    })
  }

  {/* -------------------------- CUSTOM TEXT FIELD RENDER -----------------------*/ }
  return (
    <div key={index}>

      {/* TOOLBAR */}
      {(isCustomTextFieldFocused || isSelectOpen || showTextColorOptions || showTextHighlightOptions) && isEditable && !isDraggable && (
        <StyledDiv isDarkMode={isDarkMode} ref={toolbarRef}>
          <CustomTextFieldToolbar
            index={index}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            isDarkMode={isDarkMode}
            onSelectStyle={(style: string) => handleStyleChange(style, index)}
            onTypeChange={handleTypeChange}
            onTextColorChange={handleTextColorChange}
            onTextHighlightChange={handleTextHighlightChange}
            textType={item.type}
            setIsSelectOpen={setIsSelectOpen}
            showTextColorOptions={showTextColorOptions}
            showTextHighlightOptions={showTextHighlightOptions}
            setShowTextColorOptions={setShowTextColorOptions}
            setShowTextHighlightOptions={setShowTextHighlightOptions}
            activeTextColor={activeTextColor}
            activeTextHighlightColor={activeTextHighlightColor}
            setActiveTextColor={setActiveTextColor}
            setActiveTextHighlightColor={setActiveTextHighlightColor}
            isBold={isBold}
            isItalic={isItalic}
            isUnderline={isUnderline}
            setIsBold={setIsBold}
            setIsItalic={setIsItalic}
            setIsUnderline={setIsUnderline}
          />
        </StyledDiv>
      )}

      {/* CUSTOM TEXT FIELD COMPONENT */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{ outline: isCustomTextFieldFocused ? '3px solid #1976d2' : 'none', borderRadius: '5px', display: 'flex', width: '100%' }}>
          <TextField
            ref={toolbarRef}
            id={uuid}
            value={item.content}
            fullWidth
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
            multiline
            variant="standard"
            disabled={(!isEditable || isDraggable)}
            InputProps={{
              disableUnderline: true,
              sx: {
                // Override Color For Disabled TextField
                '& .MuiInputBase-input.Mui-disabled': {
                  WebkitTextFillColor: isDarkMode ? '#ffffff' : (item.elementStyling.split(';').find(style => style.includes('color'))?.split(':')[1]?.trim() || '#000000'),
                },
              },
              style: {
                fontSize: item.type === 'Heading 1' ? '48px' : item.type === 'Heading 2' ? '34px' : item.type === 'Heading 3' ? '23px' : '16px',
                color: isDarkMode ? '#ffffff' : (item.elementStyling.split(';').find(style => style.includes('color'))?.split(':')[1]?.trim() || '#000000'),
                backgroundColor: item.elementStyling.split(';').find(style => style.includes('background-color'))?.split(':')[1]?.trim() || 'transparent',
                fontWeight: item.elementStyling.includes('bold') ? 'bold' : 'normal',
                fontStyle: item.elementStyling.includes('italic') ? 'italic' : 'normal',
                textDecoration: item.elementStyling.includes('underline') ? 'underline' : 'none',
                paddingLeft: '10px'
              }
            }}
            autoFocus={item.elementStyling.includes('autofocus')} // Set cursor to the new text field
            onClick={() => { setCustomTextFieldFocused(true); setComponentFocused(true); }}
            onBlur={async () => {
              // Delay the execution of losing focus to allow deletion to occur first
              setTimeout(() => {
                // Save autoFocus sate to prevent it from gaining focus again
                setPageElements((prevState) => {
                  return prevState.map((item, i) => {
                    if (i === index) {
                      return {
                        ...item,
                        elementStyling: item.elementStyling.replace('autofocus;', ''),
                      }
                    }
                    return item
                  })
                })
              }, 250)

              // Delete the element if the content is empty
              if (item.content === '') {
                handleDeleteContent(index)
              }
            }}
          />
        </div>

        {isDraggable && isEditable && <DragIndicatorIcon />}
      </div>

      {/* NEW ELEMENT MENU */}
      <NewElementMenu
        index={index}
        isTopElement={false}
        isEditable={isEditable}
        isDraggable={isDraggable}
        isDarkMode={isDarkMode}
        handleSelectType={handleSelectType}
      />
    </div>
  )
}

export default CustomTextField