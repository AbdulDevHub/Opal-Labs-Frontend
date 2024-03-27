import DeleteIcon from '@mui/icons-material/Delete'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import RepeatIcon from '@mui/icons-material/Repeat'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

interface CodeBlockToolbarElementProps {
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  isDarkMode: boolean
  toggleLineNumbers: () => void
  toggleWrapLines: () => void
  language: string
  setLanguage: (language: string) => void
  theme: string
  setTheme: (theme: Theme) => void
  setIsMenuOpen: (isMenuOpen: boolean) => void
}

type Theme = 'github' | 'dracula' | 'tomorrow_night_blue' | 'chaos'

/**
 * React Functional Component for rendering a code block toolbar element.
 *
 * @param {CodeBlockToolbarElementProps} index - Index of the element
 * @param {Function} handleDeleteContent - Function to handle deletion of content
 * @param {Function} moveElement - Function to move the element
 * @param {boolean} isDarkMode - Flag to toggle dark mode
 * @param {Function} toggleLineNumbers - Function to toggle line numbers
 * @param {Function} toggleWrapLines - Function to toggle line wrapping
 * @param {string} language - Current language setting
 * @param {Function} setLanguage - Function to set the language
 * @param {string} theme - Current theme setting
 * @param {Function} setTheme - Function to set the theme
 * @param {Function} setIsMenuOpen - Function to set menu open state
 * @return {JSX.Element} Rendered React component for the code block toolbar element
 */
const CodeBlockToolbarElement: React.FC<CodeBlockToolbarElementProps> = ({
  index,
  handleDeleteContent,
  moveElement,
  isDarkMode,
  toggleLineNumbers,
  toggleWrapLines,
  language,
  setLanguage,
  theme,
  setTheme,
  setIsMenuOpen
}) => {

  const themeOptions = ['github', 'dracula', 'tomorrow_night_blue', 'chaos']
  const languageOptions = ['javascript', 'python', 'css', 'html']

  /**
   * A description of the entire function.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event - description of parameter
   * @return {void} description of return value
   */
  const handleToolbarClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    // Stop event propagation to prevent callout from losing focus
    event.stopPropagation()
  }

  {/* -------------------------- CODE BLOCK TOOLBAR RENDER -----------------------*/ }
  return (
    <div
      onClick={handleToolbarClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        justifyContent: "center",
      }}>
      {/* -------------------------- MOVE UP/DOWN OPTIONS -----------------------*/}
      <div style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", gap: "10px", height: "100%", alignItems: "center" }}>
        <KeyboardArrowUpIcon onClick={() => moveElement(index, -1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
        <KeyboardArrowDownIcon onClick={() => moveElement(index, 1)} style={{ cursor: "pointer", color: isDarkMode ? "white" : "black" }} />
      </div>

      {/* -------------------------- LANGUAGE OPTIONS -----------------------*/}
      <div style={{ padding: "0 15px 0 5px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", height: "100%", alignItems: "center" }}>
        <FormControl size="small" variant="standard">
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            style={{ padding: '0 10px', color: isDarkMode ? "white" : "black", backgroundColor: isDarkMode ? "grey" : "white" }}
            onOpen={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
          >
            {languageOptions.map((lang) => (
              <MenuItem key={lang} value={lang}>
                {lang === 'html' || lang === 'css' ? lang.toUpperCase() : lang.capitalize()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* -------------------------- THEME OPTIONS -----------------------*/}
      <div style={{ padding: "0 15px 0 5px", borderRight: "1px solid rgba(0, 0, 0, 0.12)", height: "100%", alignItems: "center" }}>
        <FormControl size="small" variant="standard">
          <Select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            style={{ padding: '0 10px', color: isDarkMode ? "white" : "black", backgroundColor: isDarkMode ? "grey" : "white" }}
            onOpen={() => setIsMenuOpen(true)}
            onClose={() => setIsMenuOpen(false)}
          >
            {themeOptions.map((currentTheme) => (
              <MenuItem key={currentTheme} value={currentTheme}>
                {currentTheme === 'tomorrow_night_blue' ? 'Tomorrow Night Blue' : currentTheme.capitalize()}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* -------------------------- LINE TOGGLE OPTIONS -----------------------*/}
      <div style={{ display: 'flex', paddingRight: '10px', borderRight: '1px solid rgba(0, 0, 0, 0.12)', gap: '10px', height: '100%', alignItems: 'center' }}>
        <FormatListNumberedIcon style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={toggleLineNumbers} />
        <RepeatIcon style={{ cursor: 'pointer', color: isDarkMode ? 'white' : 'black' }} onClick={toggleWrapLines} />
      </div>

      {/* -------------------------- DELETE OPTIONS -----------------------*/}
      <div style={{ display: "flex", height: "100%", alignItems: "center" }}>
        <DeleteIcon
          style={{ cursor: "pointer", color: "red" }}
          onClick={() => handleDeleteContent(index)}
        />
      </div>
    </div>
  )
}

export default CodeBlockToolbarElement