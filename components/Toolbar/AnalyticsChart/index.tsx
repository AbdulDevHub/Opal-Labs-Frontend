import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

interface AnalyticsChartToolbarElementProps {
  index: number
  isDarkMode: boolean
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  setComponentFocused: (isFocused: boolean) => void
}

/**
 * Handles the click event on the toolbar to prevent propagation.
 *
 * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - The click event on the toolbar
 */
const AnalyticsChartToolbarElement: React.FC<AnalyticsChartToolbarElementProps> = ({
  index,
  isDarkMode,
  handleDeleteContent,
  moveElement,
  setComponentFocused,
}) => {
  /**
   * A description of the entire function.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - description of parameter
   * @return {void} description of return value
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent analytics chart from losing focus
    event.stopPropagation()
  }

  {/* -------------------------- ANALYTICS CHART TOOLBAR RENDER -----------------------*/ }
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
        <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
        <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
      </div>

      {/* -------------------------- DELETE OPTION -----------------------*/}
      <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => { handleDeleteContent(index); setComponentFocused(false) }}
        />
      </div>
    </div>
  )
}

export default AnalyticsChartToolbarElement