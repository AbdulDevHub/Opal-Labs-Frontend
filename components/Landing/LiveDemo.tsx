import { useState } from 'react'

import { ThemeProvider } from '@mui/material/styles'

import Editor from '@/components/Editor'
import { useColorMode } from '@/contexts/ColorMode'
import { Block, BlockType, cloneBlocks } from '@/lib/blocks/types'
import { getTheme } from '@/styles/theme'

import styles from './landing.module.css'

const themes = { light: getTheme('light'), dark: getTheme('dark') }

const seed = (): Block[] =>
  cloneBlocks([
    { type: BlockType.H2, content: 'Go on, break it.', elementStyling: 'normal' },
    {
      type: BlockType.Paragraph,
      content:
        'This is the real Opal Labs editor, running right here on the homepage. Click any line and start typing.',
      elementStyling: 'normal',
    },
    {
      type: BlockType.Todo,
      content: 'Type / on an empty line and pick a block',
      elementStyling: 'normal',
    },
    {
      type: BlockType.Todo,
      content: 'Drag a block by its ⋮⋮ handle (hover the left edge)',
      elementStyling: 'normal',
    },
    {
      type: BlockType.Todo,
      content: 'Start a line with # or - and a space',
      elementStyling: 'normal',
    },
    { type: BlockType.Todo, content: 'Find the homepage', elementStyling: 'checked' },
    {
      type: BlockType.Callout,
      content:
        'Nothing here is saved. Press Demo to get a full workspace that remembers your pages.',
      elementStyling: '✨',
    },
  ])

/** The actual block editor in a paper card, with local state only */
const LiveDemo = () => {
  const [blocks, setBlocks] = useState<Block[]>(seed)
  const [version, setVersion] = useState(0)
  // Follows the homepage's light / dark switch
  const colorMode = useColorMode()

  return (
    <ThemeProvider theme={themes[colorMode.mode]}>
      <div className={styles.demoWrap}>
      <div className={styles.demoCard}>
        <div className={styles.demoChrome}>
          <span className={styles.demoDots} aria-hidden>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.demoTitle}>✦ Playground · not saved</span>
          <button
            type="button"
            className={styles.demoReset}
            onClick={() => {
              setBlocks(seed())
              setVersion((v) => v + 1)
            }}
          >
            Reset
          </button>
        </div>
        <div className={styles.demoBody} key={version}>
          <Editor
            blocks={blocks}
            setBlocks={setBlocks}
            readOnly={false}
            pages={[]}
            openPage={() => {}}
            createSubPage={async () => undefined}
            requestDeleteSubPage={(_, onDeleted) => onDeleted()}
            dateViewCount={{}}
            isPublic={false}
            isUserBroke={false}
          />
        </div>
      </div>
      </div>
    </ThemeProvider>
  )
}

export default LiveDemo
