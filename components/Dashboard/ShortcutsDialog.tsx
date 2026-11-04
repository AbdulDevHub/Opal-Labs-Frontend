import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import { shortcut } from '@/lib/keys'

const Key = ({ children }: { children: string }) => (
  <Box
    component="kbd"
    sx={{
      fontFamily: 'inherit',
      fontSize: 12,
      fontWeight: 600,
      px: 0.75,
      py: 0.25,
      borderRadius: 1,
      border: '1px solid',
      borderColor: 'divider',
      backgroundColor: 'action.hover',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </Box>
)

const groups = () => [
  {
    title: 'General',
    items: [
      ['Search and commands', shortcut('mod', 'K')],
      ['New page', shortcut('mod', 'alt', 'N')],
      ['Save now', shortcut('mod', 'S')],
      ['Toggle sidebar', shortcut('mod', '\\')],
      ['Toggle dark mode', shortcut('mod', 'shift', 'L')],
      ['Show shortcuts', shortcut('mod', '/')],
    ],
  },
  {
    title: 'Blocks',
    items: [
      ['Insert a block', '/'],
      ['New block / split', 'Enter'],
      ['Line break inside a block', shortcut('shift', 'Enter')],
      ['Merge with the block above', 'Backspace'],
      ['Move between blocks', '↑ ↓'],
      ['Move block up / down', shortcut('mod', 'shift', '↑/↓')],
      ['Duplicate block', shortcut('mod', 'D')],
      ['Bold / italic / underline', shortcut('mod', 'B/I/U')],
    ],
  },
  {
    title: 'Markdown shortcuts (type at the start of a line)',
    items: [
      ['Heading 1 / 2 / 3', '# ## ###'],
      ['Bulleted list', '-'],
      ['Numbered list', '1.'],
      ['To-do', '[]'],
      ['Quote', '>'],
      ['Divider', '---'],
      ['Code block', '```'],
    ],
  },
]

/** Cheat sheet of every keyboard shortcut */
const ShortcutsDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
    <DialogTitle sx={{ fontWeight: 700 }}>Keyboard shortcuts</DialogTitle>
    <DialogContent sx={{ pb: 3 }}>
      {groups().map((group) => (
        <Box key={group.title} sx={{ mb: 2.5 }}>
          <Box
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: 'text.secondary',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              mb: 1,
            }}
          >
            {group.title}
          </Box>
          {group.items.map(([label, keys]) => (
            <Box
              key={label}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                py: 0.75,
                borderBottom: '1px solid',
                borderColor: 'divider',
                fontSize: 14,
              }}
            >
              {label}
              <Key>{keys}</Key>
            </Box>
          ))}
        </Box>
      ))}
    </DialogContent>
  </Dialog>
)

export default ShortcutsDialog
