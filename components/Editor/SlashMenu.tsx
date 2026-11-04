import { useEffect, useRef } from 'react'

import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'

import { BlockOption } from '@/lib/blocks/registry'

type Props = {
  anchorEl: HTMLElement | null
  options: BlockOption[]
  activeIndex: number
  onHover: (index: number) => void
  onSelect: (option: BlockOption) => void
}

/** The "/" command list. Focus stays in the text box; the editor handles the arrow keys */
const SlashMenu = ({ anchorEl, options, activeIndex, onHover, onSelect }: Props) => {
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex])

  let lastGroup = ''

  return (
    <Popper
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      placement="bottom-start"
      sx={{ zIndex: 1300 }}
      modifiers={[
        { name: 'offset', options: { offset: [0, 6] } },
        { name: 'flip', enabled: true },
      ]}
    >
      <Paper
        ref={listRef}
        role="listbox"
        aria-label="Insert block"
        onMouseDown={(event) => event.preventDefault()}
        sx={{
          width: 320,
          maxHeight: 360,
          overflowY: 'auto',
          p: 0.5,
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? '0 16px 40px rgba(0,0,0,0.55)'
              : '0 16px 40px rgba(15,15,15,0.14), 0 2px 6px rgba(15,15,15,0.06)',
        }}
      >
        {options.length === 0 && (
          <Box sx={{ p: 1.5, fontSize: 14, color: 'text.secondary' }}>No matching blocks</Box>
        )}
        {options.map((option, index) => {
          const header = option.group !== lastGroup ? option.group : null
          lastGroup = option.group
          const Icon = option.icon
          const active = index === activeIndex
          return (
            <Box key={option.type}>
              {header && (
                <Box
                  sx={{
                    px: 1.25,
                    pt: index === 0 ? 0.75 : 1.25,
                    pb: 0.5,
                    fontSize: 11,
                    fontWeight: 600,
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  {header}
                </Box>
              )}
              <Box
                role="option"
                aria-selected={active}
                data-index={index}
                onMouseEnter={() => onHover(index)}
                onClick={() => onSelect(option)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.25,
                  px: 1,
                  py: 0.75,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  backgroundColor: active ? 'action.selected' : 'transparent',
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 1.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.paper',
                  }}
                >
                  <Icon sx={{ fontSize: 22, color: 'text.secondary' }} />
                </Box>
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 500 }}>{option.label}</Box>
                  <Box
                    sx={{
                      fontSize: 12,
                      color: 'text.secondary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {option.description}
                  </Box>
                </Box>
                {option.shortcut && (
                  <Box
                    sx={{
                      fontSize: 11,
                      color: 'text.secondary',
                      fontFamily: 'monospace',
                      opacity: 0.8,
                    }}
                  >
                    {option.shortcut}
                  </Box>
                )}
              </Box>
            </Box>
          )
        })}
      </Paper>
    </Popper>
  )
}

export default SlashMenu
