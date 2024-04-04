import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Tooltip from '@mui/material/Tooltip'

interface CheckboxToolbarElementProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  isDarkMode: boolean
}

/**
 * Handles the click event on the toolbar to prevent propagation.
 *
 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event on the toolbar
 */
const CheckboxToolbarElement: React.FC<CheckboxToolbarElementProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  isDarkMode,
}) => {
  /**
   * A description of the entire function.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - description of parameter
   * @return {void} description of return value
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent checkbox from losing focus
    event.stopPropagation()
  }

  {/* -------------------------- CHECKBOX TOOLBAR RENDER -----------------------*/ }
  return (
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
  )
}

export default CheckboxToolbarElement