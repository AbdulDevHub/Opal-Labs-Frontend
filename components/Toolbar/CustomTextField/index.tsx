import React, { useState } from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import FormatColorTextIcon from '@mui/icons-material/FormatColorText'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Tooltip from '@mui/material/Tooltip'

interface ColorOptionsProps {
  onColorChange: (color: string, index: number) => void
  elementIndex: number
  showTextHighlightOptions: boolean
  selectedTextColor: string
  selectedTextHighlightColor: string
}

/**
 * React component for displaying color options and handling color change events.
 *
 * @param {Function} onColorChange - Function to handle color change events
 * @param {number} elementIndex - Index of the element
 * @param {boolean} showTextHighlightOptions - Flag to show/hide text highlight options
 * @param {string} selectedTextColor - Selected text color
 * @param {string} selectedTextHighlightColor - Selected text highlight color
 * @return {JSX.Element} JSX element displaying color options
 */
const ColorOptions: React.FC<ColorOptionsProps> = ({ onColorChange, elementIndex, showTextHighlightOptions, selectedTextColor, selectedTextHighlightColor }) => {
  const colors = ['#212121', '#424242', '#9E9E9E', '#FFFFFF', '#795548', '#616161', '#78909C', '#CFD8DC', '#D50000', '#FF5722', '#FFC107', '#FFEB3B', '#2E7D32', '#4CAF50', '#8BC34A', '#CDDC39', '#3F51B5', '#1E88E5', '#03A9F4', '#00BCD4', '#673AB7', '#9C27B0', '#EC407A', '#F48FB1'];
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', width: '145px', position: 'absolute', zIndex: 1, padding: '5px', justifyContent: 'center', boxShadow: '0px 0px 5px rgba(0,0,0,0.3)', left: '50%', top: '125%', transform: 'translateX(-50%)', background: '#fff' }}>
      {showTextHighlightOptions && <div style={{ backgroundColor: 'transparent', width: '100%', height: '25px', margin: '4px', border: '1px solid #E0E0E0', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000', fontWeight: 'bold' }} onClick={() => onColorChange('transparent', elementIndex)}>Transparent</div>}
      {colors.map((color, index) => (
        <div key={index} style={{ backgroundColor: color, width: '25px', height: '25px', borderRadius: '50%', margin: '4px', border: '1px solid #E0E0E0', cursor: 'pointer' }} onClick={() => onColorChange(color, elementIndex)}><p style={{ color: 'white', margin: '0', padding: '0' }}>{(showTextHighlightOptions && color === selectedTextHighlightColor ? '✓' : '') || (!showTextHighlightOptions && color === selectedTextColor ? '✓' : '')}</p></div>
      ))}
    </div>
  )
}

interface CustomTextFieldToolbarProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  isDarkMode: boolean
  onSelectStyle: (style: string, index: number) => void
  onTypeChange: (type: string, index: number) => void
  onTextColorChange: (color: string, index: number) => void
  onTextHighlightChange: (highlight: string, index: number) => void
  textType: string
  setIsSelectOpen: (isSelectOpen: boolean) => void
  showTextColorOptions: boolean
  showTextHighlightOptions: boolean
  setShowTextColorOptions: (showTextColorOptions: boolean) => void
  setShowTextHighlightOptions: (showTextHighlightOptions: boolean) => void
  activeTextColor: string
  activeTextHighlightColor: string
  setActiveTextColor: (color: string) => void
  setActiveTextHighlightColor: (color: string) => void
  isBold: boolean
  setIsBold: (isBold: boolean) => void
  isItalic: boolean
  setIsItalic: (isItalic: boolean) => void
  isUnderline: boolean
  setIsUnderline: (isUnderline: boolean) => void
}

/**
 * Functional component for customizing text field toolbar.
 *
 * @param {CustomTextFieldToolbarProps} index - index of the toolbar
 * @param {CustomTextFieldToolbarProps} handleDeleteContent - function to handle content deletion
 * @param {CustomTextFieldToolbarProps} moveElement - function to handle element movement
 * @param {CustomTextFieldToolbarProps} isDarkMode - indicates if the toolbar is in dark mode
 * @param {CustomTextFieldToolbarProps} onSelectStyle - function to handle style selection
 * @param {CustomTextFieldToolbarProps} onTypeChange - function to handle type change
 * @param {CustomTextFieldToolbarProps} onTextColorChange - function to handle text color change
 * @param {CustomTextFieldToolbarProps} onTextHighlightChange - function to handle text highlight change
 * @param {CustomTextFieldToolbarProps} textType - type of the text
 * @param {CustomTextFieldToolbarProps} setIsSelectOpen - function to set select open
 * @param {CustomTextFieldToolbarProps} showTextColorOptions - option to show text color
 * @param {CustomTextFieldToolbarProps} showTextHighlightOptions - option to show text highlight
 * @param {CustomTextFieldToolbarProps} setShowTextColorOptions - function to set text color options
 * @param {CustomTextFieldToolbarProps} setShowTextHighlightOptions - function to set text highlight options
 * @param {CustomTextFieldToolbarProps} activeTextColor - active text color
 * @param {CustomTextFieldToolbarProps} activeTextHighlightColor - active text highlight color
 * @param {CustomTextFieldToolbarProps} setActiveTextColor - function to set active text color
 * @param {CustomTextFieldToolbarProps} setActiveTextHighlightColor - function to set active text highlight color
 * @param {CustomTextFieldToolbarProps} isBold - flag for bold style
 * @param {CustomTextFieldToolbarProps} setIsBold - function to set bold style
 * @param {CustomTextFieldToolbarProps} isItalic - flag for italic style
 * @param {CustomTextFieldToolbarProps} setIsItalic - function to set italic style
 * @param {CustomTextFieldToolbarProps} isUnderline - flag for underline style
 * @param {CustomTextFieldToolbarProps} setIsUnderline - function to set underline style
 * @return {ReactNode} JSX element for the toolbar
 */
const CustomTextFieldToolbar: React.FC<CustomTextFieldToolbarProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  isDarkMode,
  onSelectStyle,
  onTypeChange,
  onTextColorChange,
  onTextHighlightChange,
  textType,
  setIsSelectOpen,
  showTextColorOptions,
  showTextHighlightOptions,
  setShowTextColorOptions,
  setShowTextHighlightOptions,
  activeTextColor,
  activeTextHighlightColor,
  setActiveTextColor,
  setActiveTextHighlightColor,
  isBold,
  setIsBold,
  isItalic,
  setIsItalic,
  isUnderline,
  setIsUnderline
}) => {
  {/* -------------------------- CUSTOM TEXT FIELD STATES -----------------------*/ }
  const [activeStyle, setActiveStyle] = useState(textType)

  {/* -------------------------- CUSTOM TEXT FIELD FUNCTIONS/HANDLERS -----------------------*/ }

  /**
   * Toggles the visibility of the text highlight options and hides the text color options.
   *
   * @return {void} 
   */
  const handleFillIconClick = () => {
    setShowTextHighlightOptions(!showTextHighlightOptions)
    setShowTextColorOptions(false)
  }

  /**
   * Toggles the visibility of the text color options and hides the text highlight options.
   *
   * @return {void} No return value.
   */
  const handleTextIconClick = () => {
    setShowTextColorOptions(!showTextColorOptions)
    setShowTextHighlightOptions(false)
  }

  /**
   * Handles the color change event.
   *
   * @param {string} color - The new color value.
   * @param {number} index - The index of the color change event.
   */
  const onColorChange = (color: string, index: number) => {
    if (showTextHighlightOptions) {
      setActiveTextHighlightColor(color)
      onTextHighlightChange(color, index)
      setShowTextHighlightOptions(false)
    } else if (showTextColorOptions) {
      setActiveTextColor(color)
      onTextColorChange(color, index)
      setShowTextColorOptions(false)
    }
  }

  /**
   * Handles the click event on the toolbar.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event object.
   * @return {void} This function does not return a value.
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent callout from losing focus
    event.stopPropagation()
  }

  /**
   * A description of the entire function.
   *
   * @param {SelectChangeEvent<string>} event - description of parameter
   * @return {void} description of return value
   */
  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    const selectedType = event.target.value
    setActiveStyle(selectedType)
    onTypeChange(selectedType, index)
  }

  {/* -------------------------- CUSTOM TEXT FIELD TOOLBAR RENDER -----------------------*/ }
  return (
    <div >
      <div
        onClick={handleToolbarClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* -------------------------- Main Toolbar Section -----------------------*/}
        <div onClick={handleToolbarClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
          {/* -------------------------- MOVE UP/DOWN OPTIONS -----------------------*/}
          <div style={{ display: 'flex', paddingRight: '10px', borderRight: '1px solid rgba(0, 0, 0, 0.12)', gap: '10px', height: '100%', alignItems: 'center' }}>
            <Tooltip title="Move Up">
              <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} />
            </Tooltip>

            <Tooltip title="Move Down">
              <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} />
            </Tooltip>
          </div>

          {/* -------------------------- TEXT FORMATTING OPTION -----------------------*/}
          <div style={{ padding: '0 15px 0 5px', borderRight: '1px solid rgba(0, 0, 0, 0.12)', height: '100%', alignItems: 'center' }}>
            <FormControl size="small" variant="standard">
              <Select
                value={activeStyle}
                onChange={handleTypeChange}
                style={{ padding: '0 10px', color: isDarkMode ? 'white' : 'black', backgroundColor: isDarkMode ? "grey" : "white" }}
                onOpen={() => setIsSelectOpen(true)}
                onClose={() => setIsSelectOpen(false)}
              >
                <MenuItem value="Heading 1">Heading 1</MenuItem>
                <MenuItem value="Heading 2">Heading 2</MenuItem>
                <MenuItem value="Heading 3">Heading 3</MenuItem>
                <MenuItem value="Paragraph">Paragraph</MenuItem>
              </Select>
            </FormControl>
          </div>

          {/* -------------------------- TEXT STYLING TOOLBAR OPTIONS -----------------------*/}
          <div style={{
            display: 'flex', paddingRight: '10px', borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            gap: '10px', height: '100%', alignItems: 'center'
          }}>
            <Tooltip title="Bold">
              <FormatBoldIcon
                style={{
                  cursor: 'pointer', backgroundColor: isBold ? '#E0E0E0' : 'transparent',
                  borderRadius: isBold ? '5px' : '0', color: isDarkMode ? 'white' : 'black'
                }}
                onClick={() => { onSelectStyle('bold', index); setIsBold(!isBold) }} />
            </Tooltip>

            <Tooltip title="Italic">
              <FormatItalicIcon
                style={{
                  cursor: 'pointer', backgroundColor: isItalic ? '#E0E0E0' : 'transparent',
                  borderRadius: isItalic ? '5px' : '0', color: isDarkMode ? 'white' : 'black'
                }}
                onClick={() => { onSelectStyle('italic', index); setIsItalic(!isItalic) }} />
            </Tooltip>

            <Tooltip title="Underline">
              <FormatUnderlinedIcon
                style={{
                  cursor: 'pointer', backgroundColor: isUnderline ? '#E0E0E0' : 'transparent',
                  borderRadius: isUnderline ? '5px' : '0', color: isDarkMode ? 'white' : 'black'
                }}
                onClick={() => { onSelectStyle('underline', index); setIsUnderline(!isUnderline) }} />
            </Tooltip>
          </div>

          {/* -------------------------- TEXT COLOR AND TEXT HIGHLIGHT OPTIONS -----------------------*/}
          <div style={{ display: 'flex', paddingRight: '10px', borderRight: '1px solid rgba(0, 0, 0, 0.12)', gap: '10px', height: '100%', alignItems: 'center', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <Tooltip title="Text Color">
                <FormatColorTextIcon style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={() => handleTextIconClick()} />
              </Tooltip>
              {showTextColorOptions && <ColorOptions onColorChange={onColorChange} elementIndex={index} showTextHighlightOptions={false} selectedTextColor={activeTextColor} selectedTextHighlightColor={activeTextHighlightColor} />}
            </div>
            <div style={{ position: 'relative' }}>
              <Tooltip title="Text Highlight Color">
                <FormatColorFillIcon style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={() => handleFillIconClick()} />
              </Tooltip>
              {showTextHighlightOptions && <ColorOptions onColorChange={onColorChange} elementIndex={index} showTextHighlightOptions={true} selectedTextColor={activeTextColor} selectedTextHighlightColor={activeTextHighlightColor} />}
            </div>
          </div>

          {/* -------------------------- DELETE OPTION -----------------------*/}
          <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <Tooltip title="Delete">
              <DeleteIcon style={{ cursor: 'pointer', color: 'red' }} onClick={() => handleDeleteContent(index)} />
            </Tooltip>
          </div>
        </div>
      </div >
    </div>
  )
}

export default CustomTextFieldToolbar