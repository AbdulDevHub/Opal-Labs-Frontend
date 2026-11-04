import dynamic from 'next/dynamic'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Popover from '@mui/material/Popover'
import { useTheme } from '@mui/material/styles'

// The picker touches `window`, so it only loads in the browser
const EmojiPicker = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => (
    <Box sx={{ width: 320, height: 380, display: 'grid', placeItems: 'center' }}>
      <CircularProgress size={24} />
    </Box>
  ),
})

const RANDOM_EMOJIS = [
  '🚀',
  '📚',
  '🌱',
  '🎯',
  '💡',
  '🧠',
  '🔥',
  '🎨',
  '🪐',
  '🌊',
  '🍀',
  '⚡',
  '🦊',
  '📝',
]

type Props = {
  anchorEl: HTMLElement | null
  onClose: () => void
  /** Called with the chosen emoji, or '' for "Remove" */
  onSelect: (emoji: string) => void
  allowRemove?: boolean
}

/** Emoji picker in a popover, used for page icons and callouts */
const EmojiPickerPopover = ({ anchorEl, onClose, onSelect, allowRemove = false }: Props) => {
  const theme = useTheme()

  const choose = (emoji: string) => {
    onSelect(emoji)
    onClose()
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      slotProps={{ paper: { sx: { overflow: 'hidden' } } }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5, p: 0.75 }}>
        <Button
          size="small"
          color="inherit"
          onClick={() => choose(RANDOM_EMOJIS[Math.floor(Math.random() * RANDOM_EMOJIS.length)])}
        >
          Random
        </Button>
        {allowRemove && (
          <Button size="small" color="inherit" onClick={() => choose('')}>
            Remove
          </Button>
        )}
      </Box>
      <EmojiPicker
        onEmojiClick={(data) => choose(data.emoji)}
        theme={theme.palette.mode as never}
        emojiStyle={'native' as never}
        lazyLoadEmojis
        width={320}
        height={380}
        previewConfig={{ showPreview: false }}
        skinTonesDisabled
      />
    </Popover>
  )
}

export default EmojiPickerPopover
