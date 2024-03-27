import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface NestedPageToolbarElementProps {
  index: number
  isDarkMode: boolean
  deleteNestedPageAndElement: () => void
  moveElement: (index: number, moveBy: number) => void
}


/**
 * A description of the entire function.
 *
 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - description of parameter
 * @return {void} description of return value
 */
const NestedPageToolbarElement: React.FC<NestedPageToolbarElementProps> = ({
  index,
  isDarkMode,
  deleteNestedPageAndElement,
  moveElement,
}) => {
  /**
   * A description of the entire function.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - description of parameter
   * @return {void} description of return value
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
    // Stop event propagation to prevent nested page from losing focus
    event.stopPropagation()
  }

  {/* -------------------------- NESTED PAGE TOOLBAR RENDER -----------------------*/ }
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
          <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
          <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
        </div>

        {/* -------------------------- DELETE OPTION -----------------------*/}
        <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
          <DeleteIcon
            style={{ cursor: "pointer", color: "red" }}
            onClick={() => deleteNestedPageAndElement()}
          />
        </div>
      </div>
    </div>
  )
}

export default NestedPageToolbarElement