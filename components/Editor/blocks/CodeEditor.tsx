import AceEditor from 'react-ace'

import 'ace-builds/src-noconflict/mode-css'

import 'ace-builds/src-noconflict/ace'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-c_cpp'
import 'ace-builds/src-noconflict/mode-golang'
import 'ace-builds/src-noconflict/mode-html'
import 'ace-builds/src-noconflict/mode-java'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-markdown'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/mode-rust'
import 'ace-builds/src-noconflict/mode-sh'
import 'ace-builds/src-noconflict/mode-sql'
import 'ace-builds/src-noconflict/mode-typescript'
import 'ace-builds/src-noconflict/theme-chaos'
import 'ace-builds/src-noconflict/theme-dracula'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-github_dark'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-one_dark'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/src-noconflict/theme-tomorrow_night_blue'

type Props = {
  value: string
  onChange: (value: string) => void
  language: string
  theme: string
  showLineNumbers: boolean
  wrapLines: boolean
  readOnly: boolean
  autoFocus: boolean
  name: string
}

/** Ace editor; loaded only in the browser (see CodeBlock) */
const CodeEditor = (props: Props) => (
  <AceEditor
    name={props.name}
    mode={props.language}
    theme={props.theme}
    value={props.value}
    onChange={props.onChange}
    readOnly={props.readOnly}
    focus={props.autoFocus}
    width="100%"
    fontSize={14}
    minLines={3}
    maxLines={Infinity}
    wrapEnabled={props.wrapLines}
    showPrintMargin={false}
    highlightActiveLine={!props.readOnly}
    editorProps={{ $blockScrolling: true }}
    setOptions={{
      // Syntax-check workers are loaded from a URL that doesn't exist in the Next build
      useWorker: false,
      showLineNumbers: props.showLineNumbers,
      showGutter: props.showLineNumbers,
      tabSize: 2,
      fontFamily: '"JetBrains Mono", "Fira Code", Menlo, Consolas, monospace',
    }}
    style={{ lineHeight: 1.6, padding: '6px 0' }}
  />
)

export default CodeEditor
