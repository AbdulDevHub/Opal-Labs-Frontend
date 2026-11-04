import { Fragment, ReactNode, useState } from 'react'

import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Checkbox from '@mui/material/Checkbox'
import InputBase from '@mui/material/InputBase'
import { alpha, SxProps, Theme, useTheme } from '@mui/material/styles'

import EmojiPickerPopover from '@/components/Shared/EmojiPickerPopover'
import { parseTextStyle, updateTextStyle } from '@/lib/blocks/styling'
import { Block, BlockType } from '@/lib/blocks/types'

import { useEditor } from '../context'

/** Font settings per block type; line heights are used to line up the gutter */
export const TEXT_METRICS: Record<
  string,
  { fontSize: number; lineHeight: number; weight: number }
> = {
  [BlockType.H1]: { fontSize: 30, lineHeight: 1.3, weight: 700 },
  [BlockType.H2]: { fontSize: 24, lineHeight: 1.3, weight: 650 },
  [BlockType.H3]: { fontSize: 19, lineHeight: 1.35, weight: 600 },
  [BlockType.Quote]: { fontSize: 17, lineHeight: 1.6, weight: 400 },
}
export const DEFAULT_METRICS = { fontSize: 16, lineHeight: 1.65, weight: 400 }

const PLACEHOLDERS: Record<string, string> = {
  [BlockType.H1]: 'Heading 1',
  [BlockType.H2]: 'Heading 2',
  [BlockType.H3]: 'Heading 3',
  [BlockType.Bulleted]: 'List',
  [BlockType.Numbered]: 'List',
  [BlockType.Todo]: 'To-do',
  [BlockType.Quote]: 'Quote',
  [BlockType.Callout]: 'Type something…',
}

const URL_PATTERN = /(https?:\/\/[^\s]+)/g

/** Turns links in read-only text into anchors */
const linkify = (text: string) =>
  text.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a key={i} href={part} target="_blank" rel="noreferrer noopener">
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    )
  )

type Props = {
  block: Block
  /** Position in a run of numbered list items, starting at 1 */
  listNumber?: number
}

/**
 * Paragraphs, headings, lists, to-dos, quotes and callouts: a growing textarea
 * (or plain text on published pages) styled from the block's styling string.
 */
const TextBlock = ({ block, listNumber = 1 }: Props) => {
  const editor = useEditor()
  const theme = useTheme()
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null)

  const isCallout = block.type === BlockType.Callout
  const style = isCallout ? parseTextStyle('') : parseTextStyle(block.elementStyling)
  const metrics = TEXT_METRICS[block.type] ?? DEFAULT_METRICS
  const isTodo = block.type === BlockType.Todo
  const done = isTodo && style.checked

  const textStyle: SxProps<Theme> = {
    fontSize: metrics.fontSize,
    lineHeight: metrics.lineHeight,
    fontWeight: style.bold ? 700 : metrics.weight,
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration:
      [style.underline && 'underline', (style.strikethrough || done) && 'line-through']
        .filter(Boolean)
        .join(' ') || 'none',
    color: style.color ?? 'text.primary',
    opacity: done ? 0.5 : 1,
    letterSpacing: metrics.fontSize > 18 ? '-0.015em' : 'normal',
    transition: 'opacity 150ms',
  }

  const placeholder =
    PLACEHOLDERS[block.type] ??
    (editor.readOnly ? '' : "Type '/' for commands, or just start writing")
  const isParagraph = !PLACEHOLDERS[block.type]

  const text = editor.readOnly ? (
    <Box
      sx={{
        ...textStyle,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        minHeight: `${metrics.fontSize * metrics.lineHeight}px`,
        '& a': { color: 'primary.main', textUnderlineOffset: 3 },
      }}
    >
      {linkify(block.content)}
    </Box>
  ) : (
    <InputBase
      multiline
      fullWidth
      value={block.content}
      placeholder={placeholder}
      inputRef={(element: HTMLTextAreaElement | null) =>
        editor.registerInput(block.element_uuid, element)
      }
      onChange={(event) => editor.onTextChange(block, event.target.value)}
      onKeyDown={(event) => editor.onTextKeyDown(event, block)}
      onFocus={() => editor.onTextFocus(block)}
      onBlur={() => editor.onTextBlur(block)}
      inputProps={{ 'aria-label': `${PLACEHOLDERS[block.type] ?? 'Text'} block`, spellCheck: true }}
      sx={{
        p: 0,
        display: 'block',
        '& textarea': { ...(textStyle as object), p: 0 },
        '& textarea::placeholder': { color: 'text.secondary', opacity: 0.55 },
        ...(isParagraph && {
          '& textarea:not(:focus)::placeholder': { opacity: 0 },
        }),
      }}
    />
  )

  const markerSx: SxProps<Theme> = {
    flexShrink: 0,
    width: 26,
    fontSize: metrics.fontSize,
    lineHeight: `${metrics.fontSize * metrics.lineHeight}px`,
    color: style.color ?? 'text.primary',
    userSelect: 'none',
  }

  // Whatever sits left of the text. The text box itself always stays in the same place in the
  // tree, so turning a paragraph into a list (etc.) keeps focus and the caret where they were
  let marker: ReactNode = null
  if (block.type === BlockType.Bulleted) {
    marker = (
      <Box aria-hidden sx={{ ...markerSx, textAlign: 'center', fontSize: metrics.fontSize * 1.35 }}>
        •
      </Box>
    )
  } else if (block.type === BlockType.Numbered) {
    marker = (
      <Box aria-hidden sx={{ ...markerSx, fontVariantNumeric: 'tabular-nums' }}>
        {listNumber}.
      </Box>
    )
  } else if (isTodo) {
    marker = (
      <Checkbox
        size="small"
        checked={done}
        tabIndex={editor.readOnly ? -1 : 0}
        onChange={() =>
          !editor.readOnly &&
          editor.updateBlock(block.element_uuid, {
            elementStyling: updateTextStyle(block.elementStyling, { checked: !done }),
          })
        }
        inputProps={{ 'aria-label': done ? 'Mark as not done' : 'Mark as done' }}
        sx={{
          p: '3px',
          mr: 0.75,
          mt: '1px',
          alignSelf: 'flex-start',
          '& svg': { fontSize: 20 },
          pointerEvents: editor.readOnly ? 'none' : 'auto',
        }}
      />
    )
  } else if (isCallout) {
    marker = (
      <ButtonBase
        aria-label="Change callout icon"
        disabled={editor.readOnly}
        onClick={(event) => setEmojiAnchor(event.currentTarget)}
        sx={{
          fontSize: 20,
          width: 28,
          height: 28,
          mr: 1.25,
          borderRadius: 1,
          flexShrink: 0,
          '&:hover': { backgroundColor: 'action.hover' },
        }}
      >
        {block.elementStyling || '💡'}
      </ButtonBase>
    )
  }

  const wrapperSx: SxProps<Theme> = isCallout
    ? {
        p: '14px 16px 14px 12px',
        borderRadius: 2,
        backgroundColor:
          theme.palette.mode === 'dark' ? alpha('#FFFFFF', 0.055) : alpha('#37352F', 0.045),
        border: '1px solid',
        borderColor: 'divider',
      }
    : block.type === BlockType.Quote
    ? { borderLeft: '3px solid', borderColor: 'text.primary', pl: 2, py: 0.25 }
    : {}

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', ...(wrapperSx as object) }}>
      {marker}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          borderRadius: 1,
          pt: isCallout ? '1px' : 0,
          ...(style.highlight && { backgroundColor: style.highlight, px: 0.75, mx: -0.75 }),
        }}
      >
        {text}
      </Box>
      {isCallout && (
        <EmojiPickerPopover
          anchorEl={emojiAnchor}
          onClose={() => setEmojiAnchor(null)}
          onSelect={(emoji) =>
            editor.updateBlock(block.element_uuid, { elementStyling: emoji || '💡' })
          }
        />
      )}
    </Box>
  )
}

export default TextBlock
