import NextLink from 'next/link'

import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'

import { Block, parsePageEtc } from '@/lib/blocks/types'

import { useEditor } from '../context'

/** A link to a sub-page, showing its current name and icon */
const SubPageBlock = ({ block }: { block: Block }) => {
  const editor = useEditor()
  const pageUuid = block.elementStyling
  const page = editor.pages.find((p) => p.page_uuid === pageUuid)
  const missing = !editor.isPublishedView && editor.pages.length > 0 && !page
  const name = page?.page_name || editor.subPageNames[pageUuid] || block.content || 'Untitled'
  const icon = parsePageEtc(page?.etc).icon

  const content = (
    <>
      <Box
        component="span"
        sx={{
          width: 24,
          display: 'inline-flex',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        {icon || <DescriptionOutlinedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />}
      </Box>
      <Box
        component="span"
        sx={{
          fontWeight: 500,
          textDecoration: missing ? 'line-through' : 'underline',
          textDecorationColor: (theme) => theme.palette.divider,
          textUnderlineOffset: 4,
          textDecorationThickness: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {missing ? 'Deleted page' : name}
      </Box>
    </>
  )

  const sx = {
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    width: '100%',
    justifyContent: 'flex-start',
    px: 0.5,
    py: 0.5,
    borderRadius: 1,
    fontSize: 16,
    color: missing ? 'text.secondary' : 'text.primary',
    textDecoration: 'none',
    '&:hover': { backgroundColor: 'action.hover' },
  }

  if (editor.isPublishedView) {
    return (
      <Box component={NextLink} href={`/live/${pageUuid}`} sx={sx}>
        {content}
      </Box>
    )
  }

  return (
    <ButtonBase
      sx={sx}
      disabled={missing}
      onClick={() => editor.openPage(pageUuid)}
      aria-label={`Open sub-page ${name}`}
    >
      {content}
    </ButtonBase>
  )
}

export default SubPageBlock
