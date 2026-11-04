import { ReactNode } from 'react'

import AddIcon from '@mui/icons-material/Add'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Block } from '@/lib/blocks/types'
import { useSortable } from '@dnd-kit/sortable'

import { blockSpacing, blockSpacingBelow, gutterOffset } from './BlockRenderer'

type Props = {
  block: Block
  children: ReactNode
  onAdd: (blockId: string) => void
  onOpenMenu: (blockId: string, anchor: HTMLElement) => void
  selected: boolean
}

/**
 * Wraps an editable block: the hover gutter with "+" (add below) and the drag handle
 * (drag to reorder, click for the block menu).
 */
export const BlockShell = ({ block, children, onAdd, onOpenMenu, selected }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.element_uuid })

  return (
    <Box
      ref={setNodeRef}
      data-block-id={block.element_uuid}
      style={{
        transform: transform ? `translate3d(0, ${Math.round(transform.y)}px, 0)` : undefined,
        transition,
      }}
      sx={{
        position: 'relative',
        pt: `${blockSpacing(block.type)}px`,
        pb: `${blockSpacingBelow(block.type)}px`,
        zIndex: isDragging ? 3 : 'auto',
        opacity: isDragging ? 0.55 : 1,
        '&:hover > .block-gutter, &:focus-within > .block-gutter': { opacity: 1 },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: `${blockSpacing(block.type) - 2}px -6px 0 -6px`,
          borderRadius: 1.5,
          pointerEvents: 'none',
          backgroundColor: (theme) =>
            selected ? `${theme.palette.primary.main}1F` : 'transparent',
          transition: 'background-color 150ms',
        },
      }}
    >
      <Box
        className="block-gutter"
        sx={{
          position: 'absolute',
          left: -54,
          top: gutterOffset(block.type),
          display: { xs: 'none', sm: 'flex' },
          alignItems: 'center',
          gap: '1px',
          opacity: isDragging || selected ? 1 : 0,
          transition: 'opacity 120ms',
          color: 'text.secondary',
          '& .MuiIconButton-root': { width: 24, height: 26, borderRadius: 1, color: 'inherit' },
        }}
      >
        <Tooltip title="Click to add a block below" placement="bottom">
          <IconButton aria-label="Add block below" onClick={() => onAdd(block.element_uuid)}>
            <AddIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>
        <Tooltip title="Drag to move · Click for options" placement="bottom">
          <IconButton
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            aria-label="Block options"
            onClick={(event) => onOpenMenu(block.element_uuid, event.currentTarget)}
            sx={{ cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
          >
            <DragIndicatorIcon sx={{ fontSize: 19 }} />
          </IconButton>
        </Tooltip>
      </Box>
      {children}
    </Box>
  )
}

/** Same spacing as BlockShell for read-only pages */
export const StaticBlockShell = ({ block, children }: { block: Block; children: ReactNode }) => (
  <Box sx={{ pt: `${blockSpacing(block.type)}px`, pb: `${blockSpacingBelow(block.type)}px` }}>{children}</Box>
)
