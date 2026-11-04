import { KeyboardEvent, useEffect, useRef, useState } from 'react'

import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import InputBase from '@mui/material/InputBase'
import Popover from '@mui/material/Popover'

import EmojiPickerPopover from '@/components/Shared/EmojiPickerPopover'
import { coverBackground, COVERS, randomCover } from '@/lib/blocks/covers'
import type { PageEtc } from '@/lib/blocks/types'
import isURL from 'validator/lib/isURL'

type Props = {
  title: string
  onTitleChange: (title: string) => void
  etc: PageEtc
  onEtcChange: (changes: Partial<PageEtc>) => void
  readOnly: boolean
  /** Enter / ArrowDown in the title moves into the page */
  onTitleExit: () => void
  autoFocusTitle: boolean
  titleRef: React.RefObject<HTMLTextAreaElement>
  /** Width and padding of the page's text column */
  columnSx: Record<string, unknown>
}

/** Cover picker: gradient presets or an image link */
const CoverPicker = ({
  anchorEl,
  onClose,
  onPick,
}: {
  anchorEl: HTMLElement | null
  onClose: () => void
  onPick: (cover: string) => void
}) => {
  const [link, setLink] = useState('')
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      slotProps={{ paper: { sx: { width: 340, p: 1.5 } } }}
    >
      <Box sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mb: 1 }}>Gradients</Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
        {COVERS.map((cover) => (
          <ButtonBase
            key={cover.id}
            aria-label={`${cover.name} cover`}
            onClick={() => {
              onPick(cover.id)
              onClose()
            }}
            sx={{
              height: 48,
              borderRadius: 1.5,
              background: cover.background,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
        ))}
      </Box>
      <Box sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', mt: 2, mb: 1 }}>
        Image link
      </Box>
      <Box
        component="form"
        sx={{ display: 'flex', gap: 1 }}
        onSubmit={(event) => {
          event.preventDefault()
          if (isURL(link, { require_protocol: true })) {
            onPick(link)
            onClose()
          }
        }}
      >
        <InputBase
          value={link}
          onChange={(event) => setLink(event.target.value)}
          placeholder="https://images.unsplash.com/…"
          inputProps={{ 'aria-label': 'Cover image link' }}
          sx={{
            flex: 1,
            fontSize: 13,
            px: 1,
            borderRadius: 1.5,
            border: '1px solid',
            borderColor: 'divider',
          }}
        />
        <Button
          type="submit"
          size="small"
          variant="contained"
          disabled={!isURL(link, { require_protocol: true })}
        >
          Use
        </Button>
      </Box>
    </Popover>
  )
}

/** Cover image, page icon and the big title, Notion style */
const PageHeader = ({
  title,
  onTitleChange,
  etc,
  onEtcChange,
  readOnly,
  onTitleExit,
  autoFocusTitle,
  titleRef,
  columnSx,
}: Props) => {
  const [emojiAnchor, setEmojiAnchor] = useState<HTMLElement | null>(null)
  const [coverAnchor, setCoverAnchor] = useState<HTMLElement | null>(null)
  const addIconRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (autoFocusTitle) titleRef.current?.focus()
  }, [autoFocusTitle, titleRef])

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === 'ArrowDown') {
      const el = titleRef.current
      if (event.key === 'ArrowDown' && el && el.selectionStart < el.value.length) return
      event.preventDefault()
      onTitleExit()
    }
  }

  const cover = coverBackground(etc.cover)

  return (
    <Box sx={{ '&:hover .header-actions': { opacity: 1 } }}>
      {cover && (
        <Box
          sx={{
            position: 'relative',
            height: { xs: 150, sm: 220 },
            background: cover,
            '&:hover .cover-actions': { opacity: 1 },
          }}
        >
          {!readOnly && (
            <Box
              className="cover-actions"
              sx={{
                position: 'absolute',
                right: 16,
                bottom: 12,
                display: 'flex',
                gap: 0.75,
                opacity: { xs: 1, md: 0 },
                transition: 'opacity 150ms',
              }}
            >
              {['Change cover', 'Remove'].map((label) => (
                <Button
                  key={label}
                  size="small"
                  onClick={(event) =>
                    label === 'Remove'
                      ? onEtcChange({ cover: undefined })
                      : setCoverAnchor(event.currentTarget)
                  }
                  sx={{
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    color: '#37352F',
                    fontSize: 12,
                    py: 0.25,
                    backdropFilter: 'blur(6px)',
                    '&:hover': { backgroundColor: '#FFFFFF' },
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          )}
        </Box>
      )}

      <Box sx={{ ...columnSx, pt: cover ? 0 : { xs: 5, sm: 9 } }}>
        {etc.icon && (
          <ButtonBase
            aria-label="Change page icon"
            disabled={readOnly}
            onClick={(event) => setEmojiAnchor(event.currentTarget)}
            sx={{
              fontSize: { xs: 56, sm: 72 },
              lineHeight: 1,
              width: { xs: 72, sm: 88 },
              height: { xs: 72, sm: 88 },
              borderRadius: 2,
              mt: cover ? { xs: -4.5, sm: -5.5 } : 0,
              position: 'relative',
              '&:hover': { backgroundColor: 'action.hover' },
            }}
          >
            {etc.icon}
          </ButtonBase>
        )}

        {!readOnly && (!etc.icon || !etc.cover) && (
          <Box
            className="header-actions"
            sx={{
              display: 'flex',
              gap: 0.5,
              mt: etc.icon ? 1 : cover ? 2 : 0,
              mb: 0.5,
              opacity: { xs: 1, md: 0 },
              transition: 'opacity 150ms',
              minHeight: 28,
            }}
          >
            {!etc.icon && (
              <Button
                ref={addIconRef}
                size="small"
                color="inherit"
                startIcon={<AddReactionOutlinedIcon fontSize="small" />}
                onClick={(event) => setEmojiAnchor(event.currentTarget)}
                sx={{ color: 'text.secondary', fontSize: 13 }}
              >
                Add icon
              </Button>
            )}
            {!etc.cover && (
              <Button
                size="small"
                color="inherit"
                startIcon={<ImageOutlinedIcon fontSize="small" />}
                onClick={() => onEtcChange({ cover: randomCover() })}
                sx={{ color: 'text.secondary', fontSize: 13 }}
              >
                Add cover
              </Button>
            )}
          </Box>
        )}

        <InputBase
          inputRef={titleRef}
          value={title}
          onChange={(event) => onTitleChange(event.target.value.replace(/\n/g, ''))}
          onKeyDown={onKeyDown}
          placeholder="Untitled"
          readOnly={readOnly}
          multiline
          fullWidth
          inputProps={{ 'aria-label': 'Page title' }}
          sx={{
            mt: readOnly && !etc.icon ? 2 : 0.5,
            p: 0,
            '& textarea': {
              fontSize: { xs: 32, sm: 40 },
              fontWeight: 750,
              lineHeight: 1.2,
              letterSpacing: '-0.025em',
              p: 0,
            },
            '& textarea::placeholder': { color: 'text.secondary', opacity: 0.4 },
          }}
        />
      </Box>

      <EmojiPickerPopover
        anchorEl={emojiAnchor}
        onClose={() => setEmojiAnchor(null)}
        onSelect={(emoji) => onEtcChange({ icon: emoji || undefined })}
        allowRemove
      />
      <CoverPicker
        anchorEl={coverAnchor}
        onClose={() => setCoverAnchor(null)}
        onPick={(value) => onEtcChange({ cover: value })}
      />
    </Box>
  )
}

export default PageHeader
