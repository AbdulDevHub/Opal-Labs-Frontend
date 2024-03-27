import React from 'react'

import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import LinkIcon from '@mui/icons-material/Link'

interface IframeToolbarElementProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  isDarkMode: boolean
  setIframeUrl: (url: string) => void
  iframeUrl: string
  showIframeInput: boolean
  setShowIframeInput: (showIframeInput: boolean) => void
  setIframeApplyUrl: (isIframeApplyUrl: boolean) => void
  setComponentFocused: (isFocused: boolean) => void
}

/**
 * Renders an iframe toolbar element.
 *
 * @param {IframeToolbarElementProps} props - The props for the IframeToolbarElement component.
 * @param {number} props.index - The index of the element.
 * @param {function} props.handleDeleteContent - The function to handle deleting content.
 * @param {function} props.moveElement - The function to move the element.
 * @param {boolean} props.isDarkMode - Whether the component is in dark mode.
 * @param {function} props.setIframeUrl - The function to set the iframe URL.
 * @param {string} props.iframeUrl - The URL of the iframe.
 * @param {boolean} props.showIframeInput - Whether to show the iframe input field.
 * @param {function} props.setShowIframeInput - The function to set whether to show the iframe input field.
 * @param {function} props.setIframeApplyUrl - The function to set whether to apply the iframe URL.
 * @param {function} props.setComponentFocused - The function to set whether the component is focused.
 * @return {ReactElement} The rendered IframeToolbarElement component.
 */
const IframeToolbarElement: React.FC<IframeToolbarElementProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  isDarkMode,
  setIframeUrl,
  iframeUrl,
  showIframeInput,
  setShowIframeInput,
  setIframeApplyUrl,
  setComponentFocused
}) => {

  /**
   * Handles the click event on the toolbar.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event.
   * @return {void} This function does not return anything.
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent callout from losing focus
    event.stopPropagation()
  }

  /**
   * If url is a youtube link (https://www.youtube.com/watch?v=NXpdyAWLDas),
   * convert it (https://www.youtube.com/embed/NXpdyAWLDas)
   */
  const handleApply = () => {
    // If url is a youtube link (https://www.youtube.com/watch?v=NXpdyAWLDas),
    // convert it (https://www.youtube.com/embed/NXpdyAWLDas)
    if (iframeUrl.includes('youtube.com/watch?v=')) {
      const videoId = iframeUrl.split('v=')[1]
      setIframeUrl(`https://www.youtube.com/embed/${videoId}`)
    }

    setIframeApplyUrl(true)
    setShowIframeInput(false)
  }

  // Focus on the input field whenever showIframeInput is true
  // Otherwise, the input loses focus everytime you type a character
  const inputRef = React.useRef<HTMLInputElement>(null)
  React.useEffect(() => {
    if (showIframeInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showIframeInput])

  {/* -------------------------- IFRAME TOOLBAR RENDER -----------------------*/ }
  return (
    <div onClick={handleToolbarClick} style={{ width: "100%", alignItems: "center" }}>
      {/* -------------------------- Main Toolbar Section -----------------------*/}
      <div onClick={handleToolbarClick} style={{ width: "100%", display: "flex", alignItems: "center", gap: "10px", justifyContent: "center" }}>
        {/* -------------------------- MOVE UP/DOWN OPTIONS -----------------------*/}
        <div style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", gap: "10px", height: "100%", alignItems: "center" }}>
          <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
          <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
        </div>

        {/* -------------------------- IFRAME LINK INPUT -----------------------*/}
        <div style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", height: "100%", alignItems: "center" }}>
          <LinkIcon style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} onClick={() => setShowIframeInput(!showIframeInput)} />
        </div>

        {/* -------------------------- DELETE ELEMENT -----------------------*/}
        <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
          <DeleteIcon
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => { handleDeleteContent(index); setComponentFocused(false) }}
          />
        </div>
      </div>

      {/* -------------------------- IFRAME LINK POP-UP -----------------------*/}
      {showIframeInput && (
        <div style={{
          width: '350px',
          padding: '15px',
          border: `1px solid ${isDarkMode ? 'white' : 'lightgray'}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1,
          marginTop: '25px',
          backgroundColor: isDarkMode ? '#212121' : 'white',
        }}>
          {/* -------------------------- IFRAME LINK INPUT -----------------------*/}
          <input
            type="text"
            ref={inputRef}
            value={iframeUrl}
            onChange={(e) => setIframeUrl(e.target.value)}
            placeholder="URL"
            style={{
              width: '100%',
              border: 'none',
              borderBottom: `1px solid ${isDarkMode ? 'white' : 'black'}`,
              outline: 'none',
              paddingBottom: '5px',
              backgroundColor: 'transparent',
            }}
          />

          {/* -------------------------- APPLY BUTTON -----------------------*/}
          <button
            onClick={handleApply}
            style={{
              marginTop: '20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: isDarkMode ? 'white' : 'black',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#1976d2')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'black')}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  )
}

export default IframeToolbarElement