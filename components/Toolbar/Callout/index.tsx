import DeleteIcon from '@mui/icons-material/Delete'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Tooltip from '@mui/material/Tooltip'

import EmojiPicker from 'emoji-picker-react'

interface CalloutToolbarElementProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  isDarkMode: boolean
  showEmojiPicker: boolean
  setShowEmojiPicker: (showEmojiPicker: boolean) => void
  onEmojiClick: (emojiObject: { emoji: string }) => void
}

/**
 * React functional component for CalloutToolbarElement.
 *
 * @param {CalloutToolbarElementProps} props - The props for the component
 * @return {JSX.Element} The rendered JSX element
 */
const CalloutToolbarElement: React.FC<CalloutToolbarElementProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  isDarkMode,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
}) => {
  /**
   * A function to handle the click event on the toolbar.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - the click event
   * @return {void} 
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent callout from losing focus
    event.stopPropagation()
  }

  {/* -------------------------- CALLOUT TOOLBAR RENDER -----------------------*/ }
  return (
    <div>
      <div
        onClick={handleToolbarClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        {/* -------------------------- MOVE UP/DOWN OPTIONS -----------------------*/}
        <div style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", gap: "10px", height: "100%", alignItems: "center" }}>
          <Tooltip title="Move Up">
            <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
          </Tooltip>

          <Tooltip title="Move Down">
            <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
          </Tooltip>
        </div>

        {/* -------------------------- EMOJI OPTION -----------------------*/}
        <div style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", height: "100%", alignItems: "center" }}>
          <div style={{ position: 'relative', backgroundColor: "transparent", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Tooltip title="Emoji Picker">
              <InsertEmoticonIcon style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} onClick={() => setShowEmojiPicker(!showEmojiPicker)} />
            </Tooltip>
            {showEmojiPicker && (
              // Place below emoji and above buttons. Also prevent useEffect from closing emoji picker when click inside of it
              <div style={{ position: 'absolute', left: '50%', top: '125%', transform: 'translateX(-50%)', zIndex: 1 }} onClick={(event) => event.stopPropagation()}>
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        </div>

        {/* -------------------------- DELETE OPTION -----------------------*/}
        <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
          <Tooltip title="Delete">
            <DeleteIcon
              style={{ cursor: "pointer", color: "red" }}
              onClick={() => handleDeleteContent(index)}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default CalloutToolbarElement