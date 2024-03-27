import { useEffect, useState } from 'react'
import AceEditor from 'react-ace'

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

{/* PROPS TYPE VALUES FOR CODE BLOCK COMPONENT */ }
interface CodeBlockElementProps {
  item: { type: string; content: string; elementStyling: string; element_uuid: string }
}

type Theme = 'github' | 'dracula' | 'tomorrow_night_blue' | 'chaos'


/**
 * Renders a code block element.
 *
 * @param {CodeBlockElementProps} item - The props for the code block element.
 * @return {ReactElement} The rendered code block element.
 */
const CodeBlockElement: React.FC<CodeBlockElementProps> = ({
  item,
}) => {
  {/* -------------------------- CODE BLOCK STATES -----------------------*/ }
  const [language, setLanguage] = useState('javascript')
  const [theme, setTheme] = useState<Theme>('github')
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [wrapLines, setWrapLines] = useState(false)

  const themeBackgrounds: Record<Theme, string> = {
    'github': '#F5F5F5',
    'dracula': '#282A36',
    'tomorrow_night_blue': '#002451',
    'chaos': '#161616'
  }

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

  {/* -------------------------- CODE BLOCK RENDER -----------------------*/ }
  return (
    <div>
      {/* CODE BLOCK COMPONENT */}
      <div style={{ position: 'relative' }}>
        <div style={{
          padding: '20px',
          borderRadius: '5px',
          background: themeBackgrounds[theme],
        }}>
          <AceEditor
            mode={language}
            theme={theme}
            readOnly={true}
            value={item.content}
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
          />
        </div>


        {/* NEW ELEMENT MENU GAP*/}
        <div style={{ height: '35px', width: '100%', marginTop: '10px' }}></div>
      </div >
    </div>
  )
}

export default CodeBlockElement