import { useState } from 'react'

import Box from '@mui/material/Box'

import Editor from '@/components/Editor'
import { PAGE_TEMPLATES } from '@/lib/blocks/templates'
import { Block, cloneBlocks } from '@/lib/blocks/types'
import type { Meta, StoryObj } from '@storybook/react'

/** The block editor with local state: try "/", markdown shortcuts and drag handles */
const EditorDemo = ({ readOnly }: { readOnly: boolean }) => {
  const [blocks, setBlocks] = useState<Block[]>(() => cloneBlocks(PAGE_TEMPLATES()[3].blocks))
  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', px: 8, py: 4 }}>
      <Editor
        blocks={blocks}
        setBlocks={setBlocks}
        readOnly={readOnly}
        pages={[]}
        openPage={() => {}}
        createSubPage={async () => undefined}
        requestDeleteSubPage={(_, onDeleted) => onDeleted()}
        dateViewCount={{}}
        isPublic={false}
        isUserBroke={false}
      />
    </Box>
  )
}

const meta: Meta<typeof EditorDemo> = {
  title: 'Editor/Block editor',
  component: EditorDemo,
}
export default meta

export const Editable: StoryObj<typeof EditorDemo> = { args: { readOnly: false } }
export const ReadOnly: StoryObj<typeof EditorDemo> = { args: { readOnly: true } }
