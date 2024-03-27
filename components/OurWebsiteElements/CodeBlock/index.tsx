import { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'

import NewElementMenu from '@/components/DashboardComponents/NewElementMenu'
import CodeBlockToolbarElement from '@/components/Toolbar/CodeBlock'
import styled from 'styled-components'

import 'ace-builds/src-noconflict/mode-css'

import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-html'
import "ace-builds/src-noconflict/theme-dracula"
import "ace-builds/src-noconflict/theme-github"
import "ace-builds/src-noconflict/theme-tomorrow_night_blue"
import "ace-builds/src-noconflict/theme-chaos"

interface Item {
  type: string;
  content: string;
  elementStyling: string;
  element_uuid: string;
}

{/* PROPS TYPE VALUES FOR CODE BLOCK COMPONENT */ }
interface CodeBlockElementProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
  index: number
  handleDeleteContent: (index: number) => void
  moveElement: (index: number, moveBy: number) => void
  handleSelectType: (type: string, index: number) => void
  isEditable: boolean
  isDarkMode: boolean
  isDraggable: boolean
  pageElements: { type: string; content: string; elementStyling: string; element_uuid: string }[]
  setPageElements: (value: Item[] | ((prevState: Item[]) => Item[])) => void
  setComponentFocused: (isFocused: boolean) => void
}

type Theme = 'github' | 'dracula' | 'tomorrow_night_blue' | 'chaos'

/**
 * Renders a code block element with editable content and styling options.
 *
 * @param {CodeBlockElementProps} props - The props object containing the following properties:
 *   - item: The content item to be rendered.
 *   - index: The index of the content item in the pageElements array.
 *   - handleDeleteContent: The function to handle the deletion of the content item.
 *   - moveElement: The function to move the content item up or down in the pageElements array.
 *   - handleSelectType: The function to handle the selection of a new content item type.
 *   - isEditable: A boolean indicating whether the content is editable.
 *   - isDraggable: A boolean indicating whether the content is draggable.
 *   - pageElements: The array of page elements.
 *   - setPageElements: The function to update the pageElements array.
 *   - setComponentFocused: The function to set the focused state of the component.
 * @return {JSX.Element} The rendered code block element.
 */
const CodeBlockElement: React.FC<CodeBlockElementProps> = ({
  item,
  index,
  handleDeleteContent,
  moveElement,
  handleSelectType,
  isEditable,
  isDarkMode,
  isDraggable,
  pageElements,
  setPageElements,
  setComponentFocused
}) => {
  {/* -------------------------- CODE BLOCK STATES -----------------------*/ }
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState<Theme>('github')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [wrapLines, setWrapLines] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const themeBackgrounds: Record<Theme, string> = {
    'github': '#F5F5F5',
    'dracula': '#282A36',
    'tomorrow_night_blue': '#002451',
    'chaos': '#161616'
  }

  // Position the toolbar to top of screen
  const StyledDiv = styled.div`
   position: fixed;
   top: 90px;
   left: 390px;
   background-color: ${isDarkMode ? '#212121' : 'white'};
   z-index: 1;
   padding: 15px;
   border-radius: 5px;
   border: 1px solid ${isDarkMode ? 'white' : 'lightgray'};
 
   @media (max-width: 1920px) and (min-width: 753px) {
     left: calc(825px + ((100vw - 1920px) / 2));
   }
 
   @media (max-width: 753px) {
     left: 240px;
   }
 
   @media (max-width: 884px) {
     top: calc(90px + 25px);
   }
 `;

  {/* -------------------------- CODE BLOCK EFFECTS -----------------------*/ }
  const aceEditorRef = useRef<AceEditor | null>(null)
  const toolbarRef = useRef<HTMLDivElement>(null)

  {/* Function to hide the toolbar if you click outside of it or the element */ }
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node) &&
        aceEditorRef.current && !aceEditorRef.current?.editor.container.contains(event.target as Node)) {
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
  }, [setComponentFocused, toolbarRef, aceEditorRef])

  {/* -------------------------- CODE BLOCK EFFECTS -----------------------*/ }
  {/* SET INITIAL STYLING FROM ELEMENT STYLING FIELD IN DATABASE */ }
  useEffect(() => {
    const styling = item.elementStyling.split(';').reduce((acc: { [key: string]: string }, style) => {
      const [key, value] = style.split(':')
      acc[key.trim()] = value ? value.trim() : ''
      return acc
    }, {})

    if (styling.theme) {
      setTheme(styling.theme as Theme)
    }

    if (styling.language) {
      setLanguage(styling.language)
    }

    if (styling.showLineNumbers) {
      setShowLineNumbers(styling.showLineNumbers === 'true')
    }

    if (styling.wrapLines) {
      setWrapLines(styling.wrapLines === 'true')
    }
  }, [item])


  {/* -------------------------- CODE BLOCK HANDLERS/FUNCTIONS -----------------------*/ }
  /**
   * Updates the styling of an element with the new theme, language, and display options.
   *
   * @param {Theme} newTheme - the new theme for the element
   * @param {string} newLanguage - the new language for the element
   * @param {boolean} showLineNumbers - flag to show line numbers
   * @param {boolean} wrapLines - flag to wrap lines
   */
  const updateElementStyling = (newTheme: Theme, newLanguage: string, showLineNumbers: boolean, wrapLines: boolean) => {
    const updatedContent = {
      ...item,
      content: item.content,
      elementStyling: `theme: ${newTheme}; language: ${newLanguage}; showLineNumbers: ${showLineNumbers}; wrapLines: ${wrapLines}`,
      ...(item.element_uuid ? { element_uuid: item.element_uuid } : {})
    }
    setPageElements([
      ...pageElements.slice(0, index),
      updatedContent,
      ...pageElements.slice(index + 1)
    ])
  }

  /**
   * Sets the language and updates the element styling.
   *
   * @param {string} newLanguage - The new language to set.
   * @return {void} This function does not return a value.
   */
  const setLanguageFunction = (newLanguage: string) => {
    setLanguage(newLanguage);
    updateElementStyling(theme, newLanguage, showLineNumbers, wrapLines);
  }

  /**
   * Set the theme and update element styling.
   *
   * @param {Theme} newTheme - the new theme to be set
   * @return {void} 
   */
  const setThemeFunction = (newTheme: Theme) => {
    setTheme(newTheme);
    updateElementStyling(newTheme, language, showLineNumbers, wrapLines);
  }

  /**
   * Toggles the visibility of line numbers and updates the element styling accordingly.
   *
   * @return {void} 
   */
  const toggleLineNumbers = () => {
    const newShowLineNumbers = !showLineNumbers;
    setShowLineNumbers(newShowLineNumbers);
    updateElementStyling(theme, language, newShowLineNumbers, wrapLines);
  }

  /**
   * Toggles the value of `wrapLines` and updates the element styling accordingly.
   *
   * @return {void} This function does not return a value.
   */
  const toggleWrapLines = () => {
    const newWrapLines = !wrapLines;
    setWrapLines(newWrapLines);
    updateElementStyling(theme, language, showLineNumbers, newWrapLines);
  }

  {/* -------------------------- CODE BLOCK RENDER -----------------------*/ }
  return (
    <div>
      {/* TOOLBAR */}
      {(isFocused || isMenuOpen) && isEditable && !isDraggable && (
        <StyledDiv ref={toolbarRef}>
          <CodeBlockToolbarElement
            index={index}
            handleDeleteContent={handleDeleteContent}
            moveElement={moveElement}
            isDarkMode={isDarkMode}
            toggleLineNumbers={toggleLineNumbers}
            toggleWrapLines={toggleWrapLines}
            language={language}
            setLanguage={setLanguageFunction}
            theme={theme}
            setTheme={setThemeFunction}
            setIsMenuOpen={setIsMenuOpen}
          />
        </StyledDiv>
      )}

      {/* CODE BLOCK COMPONENT */}
      <div style={{ position: 'relative' }}>
        <div ref={toolbarRef} style={{
          padding: '20px',
          borderRadius: '5px',
          background: themeBackgrounds[theme],
          outline: isFocused ? '2px solid #1976d2' : 'none'
        }}>
          <AceEditor
            mode={language}
            ref={aceEditorRef}
            theme={theme}
            readOnly={!isEditable || !isDraggable}
            value={item.content}
            onChange={(newValue) => {
              const updatedContent = {
                ...item,
                content: newValue,
                elementStyling: `theme: ${theme}; language: ${language}`,
                ...(item.element_uuid ? { element_uuid: item.element_uuid } : {})
              }
              setPageElements([
                ...pageElements.slice(0, index),
                updatedContent,
                ...pageElements.slice(index + 1)
              ])
            }}
            name="UNIQUE_ID_OF_DIV"
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: showLineNumbers,
              showGutter: showLineNumbers,
              highlightActiveLine: false,
              highlightGutterLine: false,
            }}
            wrapEnabled={wrapLines}
            style={theme === 'github' ? {
              width: '100%',
              background: '#F5F5F5',
            } : {
              width: '100%',
            }}
            fontSize={'16px'} // This needs to be outside otherwise it wont work for some
            maxLines={Infinity} // Allow the editor to grow as much as needed
            minLines={1} // But at least show one line
            onFocus={() => { setIsFocused(true); setComponentFocused(true); }}
          />
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
    </div>
  )
}

export default CodeBlockElement