import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Tooltip from '@mui/material/Tooltip'

import { optionFor, TURN_INTO_TYPES } from '@/lib/blocks/registry'
import { HIGHLIGHT_COLORS, parseTextStyle, TEXT_COLORS, TextStyle } from '@/lib/blocks/styling'
import { Block, BlockType, isFocusableType, isTextType } from '@/lib/blocks/types'
import { shortcut } from '@/lib/keys'

type Props = {
  anchorEl: HTMLElement | null
  block: Block | null
  onClose: () => void
  onTurnInto: (type: string) => void
  onStyle: (changes: Partial<TextStyle>) => void
  onDuplicate: () => void
  onMove: (delta: number) => void
  onDelete: () => void
}

const SectionTitle = ({ children }: { children: string }) => (
  <Box
    sx={{
      px: 1.25,
      pt: 1,
      pb: 0.5,
      fontSize: 11,
      fontWeight: 600,
      color: 'text.secondary',
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}
  >
    {children}
  </Box>
)


/** Options for one block: text style, turn into, colours, duplicate, move and delete */
const BlockMenu = ({
  anchorEl,
  block,
  onClose,
  onTurnInto,
  onStyle,
  onDuplicate,
  onMove,
  onDelete,
}: Props) => {
  if (!block) return null
  const isText = isTextType(block.type)
  const style = parseTextStyle(isText ? block.elementStyling : '')

  const toggles: {
    key: 'bold' | 'italic' | 'underline' | 'strikethrough'
    label: string
    icon: typeof FormatBoldIcon
    shortcut?: string
  }[] = [
    { key: 'bold', label: 'Bold', icon: FormatBoldIcon, shortcut: 'B' },
    { key: 'italic', label: 'Italic', icon: FormatItalicIcon, shortcut: 'I' },
    { key: 'underline', label: 'Underline', icon: FormatUnderlinedIcon, shortcut: 'U' },
    { key: 'strikethrough', label: 'Strikethrough', icon: FormatStrikethroughIcon },
  ]

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      slotProps={{ paper: { sx: { width: 264, maxHeight: '72vh', p: 0.5 } } }}
    >
      {isText && (
        <Box sx={{ display: 'flex', gap: 0.5, p: 0.5 }}>
          {toggles.map(({ key, label, icon: Icon, shortcut: key2 }) => (
            <Tooltip key={key} title={key2 ? `${label} (${shortcut('mod', key2)})` : label}>
              <IconButton
                aria-label={label}
                aria-pressed={style[key]}
                onClick={() => onStyle({ [key]: !style[key] })}
                sx={{
                  flex: 1,
                  borderRadius: 1.5,
                  color: style[key] ? 'primary.main' : 'text.secondary',
                  backgroundColor: style[key] ? 'action.selected' : 'transparent',
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          ))}
        </Box>
      )}

      {isFocusableType(block.type) && (
        <>
          <SectionTitle>Turn into</SectionTitle>
          {TURN_INTO_TYPES.map((type) => {
            const option = optionFor(type)
            const Icon = option.icon
            return (
              <MenuItem
                key={type}
                dense
                onClick={() => {
                  onTurnInto(type)
                  onClose()
                }}
              >
                <Icon fontSize="small" sx={{ color: 'text.secondary' }} />
                <Box sx={{ flex: 1 }}>{option.label}</Box>
                {block.type === type && <CheckIcon fontSize="small" />}
              </MenuItem>
            )
          })}
        </>
      )}

      {isText && (
        <>
          <SectionTitle>Text color</SectionTitle>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5, px: 0.75 }}>
            {TEXT_COLORS.map((color) => (
              <Tooltip key={color.name} title={color.name}>
                <ButtonBase
                  aria-label={`${color.name} text`}
                  onClick={() => onStyle({ color: color.value })}
                  sx={{
                    height: 32,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: style.color === color.value ? 'primary.main' : 'divider',
                    color: color.value ?? 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  A
                </ButtonBase>
              </Tooltip>
            ))}
          </Box>
          <SectionTitle>Background</SectionTitle>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: 0.5,
              px: 0.75,
              pb: 0.5,
            }}
          >
            {HIGHLIGHT_COLORS.map((color) => (
              <Tooltip key={color.name} title={`${color.name} background`}>
                <ButtonBase
                  aria-label={`${color.name} background`}
                  onClick={() => onStyle({ highlight: color.value })}
                  sx={{
                    height: 32,
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: style.highlight === color.value ? 'primary.main' : 'divider',
                    backgroundColor: color.value ?? 'transparent',
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </>
      )}

      {(isText || isFocusableType(block.type)) && <Divider sx={{ my: 0.5 }} />}

      {block.type !== BlockType.SubPage && (
        <MenuItem
          dense
          onClick={() => {
            onDuplicate()
            onClose()
          }}
        >
          <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Box sx={{ flex: 1 }}>Duplicate</Box>
          <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{shortcut('mod', 'D')}</Box>
        </MenuItem>
      )}
      <MenuItem dense onClick={() => onMove(-1)}>
        <ArrowUpwardIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Box sx={{ flex: 1 }}>Move up</Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{shortcut('mod', 'shift', '↑')}</Box>
      </MenuItem>
      <MenuItem dense onClick={() => onMove(1)}>
        <ArrowDownwardIcon fontSize="small" sx={{ color: 'text.secondary' }} />
        <Box sx={{ flex: 1 }}>Move down</Box>
        <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{shortcut('mod', 'shift', '↓')}</Box>
      </MenuItem>
      <MenuItem
        dense
        onClick={() => {
          onDelete()
          onClose()
        }}
        sx={{ color: 'error.main' }}
      >
        <DeleteOutlineIcon fontSize="small" />
        <Box sx={{ flex: 1 }}>{block.type === BlockType.SubPage ? 'Delete page' : 'Delete'}</Box>
      </MenuItem>
    </Popover>
  )
}

export default BlockMenu
