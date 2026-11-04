import { useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import PublicIcon from '@mui/icons-material/Public'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import SwapHorizIcon from '@mui/icons-material/SwapHoriz'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Popover from '@mui/material/Popover'
import Switch from '@mui/material/Switch'
import Tooltip from '@mui/material/Tooltip'

import type { SaveState } from '@/hooks/Page/usePageEditor'
import type { PageType } from '@/hooks/Page/usePageList'
import { shortcut } from '@/lib/keys'
import { liveUrl, pageIcon, pageName, relativeTime } from '@/lib/pages'

import PageIcon from './PageIcon'

type Props = {
  path: PageType[]
  onSelect: (pageUuid: string) => void
  onOpenSidebar: () => void
  showSidebarButton: boolean
  isMobile: boolean
  saveState: SaveState
  onRetrySave: () => void
  pageUuid: string
  isFavourite: boolean
  onToggleFavourite: () => void
  isPublic: boolean
  onTogglePublic: () => void
  viewCount: number
  canPublish: boolean
  isGuest: boolean
  locked: boolean
  onToggleLock: () => void
  fullWidth: boolean
  onToggleFullWidth: () => void
  onDuplicate: () => void
  onExport: () => void
  onDelete: () => void
  onCopied: (message: string) => void
  wordCount: number
  lastEdited?: string
}

const SaveIndicator = ({ state, onRetry }: { state: SaveState; onRetry: () => void }) => {
  if (state === 'error')
    return (
      <Button
        size="small"
        color="error"
        startIcon={<CloudOffOutlinedIcon />}
        onClick={onRetry}
        sx={{ fontSize: 12 }}
      >
        Couldn’t save · Retry
      </Button>
    )
  const label =
    state === 'saving' || state === 'unsaved' ? 'Saving…' : state === 'saved' ? 'Saved' : ''
  return (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        display: { xs: 'none', sm: 'flex' },
        alignItems: 'center',
        gap: 0.5,
        fontSize: 12,
        color: 'text.secondary',
        minWidth: 64,
        justifyContent: 'flex-end',
      }}
    >
      {state === 'saved' && <CheckIcon sx={{ fontSize: 14 }} />}
      {label}
    </Box>
  )
}

/** Sticky bar above the page: breadcrumbs, save status, share, favourite and page options */
const TopBar = (props: Props) => {
  const [shareAnchor, setShareAnchor] = useState<HTMLElement | null>(null)
  const [moreAnchor, setMoreAnchor] = useState<HTMLElement | null>(null)
  const url = liveUrl(props.pageUuid)

  // Long paths collapse to first / … / last two
  const crumbs = props.path.length > 3 ? [props.path[0], null, ...props.path.slice(-2)] : props.path

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      props.onCopied('Link copied')
    } catch {
      props.onCopied('Couldn’t copy the link')
    }
  }

  return (
    <Box
      component="header"
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        height: 46,
        display: 'flex',
        alignItems: 'center',
        gap: 0.5,
        px: { xs: 1, sm: 1.5 },
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.82)' : 'rgba(255,255,255,0.85)',
        backdropFilter: 'saturate(180%) blur(10px)',
      }}
    >
      {props.showSidebarButton && (
        <Tooltip title={props.isMobile ? 'Open menu' : `Open sidebar (${shortcut('mod', '\\')})`}>
          <IconButton
            aria-label="Open sidebar"
            onClick={props.onOpenSidebar}
            sx={{ color: 'text.secondary' }}
          >
            {props.isMobile ? (
              <MenuIcon fontSize="small" />
            ) : (
              <KeyboardDoubleArrowRightIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
      )}

      {/* Breadcrumbs */}
      <Box
        component="ol"
        aria-label="Breadcrumb"
        sx={{
          display: 'flex',
          alignItems: 'center',
          minWidth: 0,
          flex: 1,
          m: 0,
          p: 0,
          listStyle: 'none',
        }}
      >
        {crumbs.map((page, i) => (
          <Box
            component="li"
            key={page?.page_uuid ?? 'ellipsis'}
            sx={{
              display: 'flex',
              alignItems: 'center',
              minWidth: 0,
              flexShrink: i === crumbs.length - 1 ? 1 : 2,
            }}
          >
            {i > 0 && (
              <Box sx={{ color: 'text.secondary', opacity: 0.5, px: 0.25, fontSize: 14 }}>/</Box>
            )}
            {page ? (
              <ButtonBase
                onClick={() => props.onSelect(page.page_uuid)}
                aria-current={i === crumbs.length - 1 ? 'page' : undefined}
                sx={{
                  gap: 0.5,
                  px: 0.75,
                  py: 0.25,
                  borderRadius: 1,
                  fontSize: 14,
                  minWidth: 0,
                  color: i === crumbs.length - 1 ? 'text.primary' : 'text.secondary',
                  '&:hover': { backgroundColor: 'action.hover' },
                }}
              >
                <PageIcon icon={pageIcon(page)} size={16} />
                <Box
                  component="span"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: 200,
                  }}
                >
                  {pageName(page)}
                </Box>
              </ButtonBase>
            ) : (
              <Box sx={{ px: 0.5, color: 'text.secondary' }}>…</Box>
            )}
          </Box>
        ))}
        {props.locked && (
          <Tooltip title="This page is locked to prevent edits">
            <LockIcon sx={{ fontSize: 14, color: 'text.secondary', ml: 0.5 }} />
          </Tooltip>
        )}
      </Box>

      <SaveIndicator state={props.saveState} onRetry={props.onRetrySave} />

      <Button
        size="small"
        color="inherit"
        onClick={(event) => setShareAnchor(event.currentTarget)}
        startIcon={props.isPublic ? <PublicIcon sx={{ color: 'primary.main' }} /> : undefined}
        sx={{ fontWeight: 500, px: 1.25, ml: 0.5 }}
      >
        Share
      </Button>

      <Tooltip title={props.isFavourite ? 'Remove from favourites' : 'Add to favourites'}>
        <IconButton
          aria-label={props.isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          aria-pressed={props.isFavourite}
          onClick={props.onToggleFavourite}
        >
          {props.isFavourite ? (
            <StarIcon fontSize="small" sx={{ color: '#E9B949' }} />
          ) : (
            <StarBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          )}
        </IconButton>
      </Tooltip>

      <Tooltip title="Page options">
        <IconButton
          aria-label="Page options"
          onClick={(event) => setMoreAnchor(event.currentTarget)}
          sx={{ color: 'text.secondary' }}
        >
          <MoreHorizIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      {/* Share / publish */}
      <Popover
        open={Boolean(shareAnchor)}
        anchorEl={shareAnchor}
        onClose={() => setShareAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 360, p: 2, mt: 0.5 } } }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: props.isPublic ? 'primary.main' : 'action.selected',
              color: props.isPublic ? 'primary.contrastText' : 'text.secondary',
              transition: 'all 200ms',
            }}
          >
            <PublicIcon fontSize="small" />
          </Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ fontWeight: 600, fontSize: 14 }}>Publish to web</Box>
            <Box sx={{ fontSize: 12, color: 'text.secondary' }}>
              {props.isPublic ? 'Anyone with the link can view' : 'Only you can see this page'}
            </Box>
          </Box>
          <Switch
            checked={props.isPublic}
            disabled={!props.canPublish}
            onChange={props.onTogglePublic}
            inputProps={{ 'aria-label': 'Publish to web' }}
          />
        </Box>

        {!props.canPublish && (
          <Box
            sx={{
              mt: 1.5,
              p: 1.25,
              borderRadius: 1.5,
              fontSize: 12,
              color: 'text.secondary',
              backgroundColor: 'action.hover',
            }}
          >
            Publishing needs the Premium plan. Switch plans in the account menu (it’s a demo,
            nothing is charged).
          </Box>
        )}

        {props.isPublic && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              <InputBase
                value={url}
                readOnly
                onFocus={(event) => event.target.select()}
                inputProps={{ 'aria-label': 'Public link' }}
                sx={{
                  flex: 1,
                  fontSize: 13,
                  px: 1.25,
                  py: 0.5,
                  borderRadius: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  backgroundColor: 'action.hover',
                }}
              />
              <Button
                variant="contained"
                size="small"
                startIcon={<ContentCopyIcon fontSize="small" />}
                onClick={copyLink}
              >
                Copy
              </Button>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: 1.5,
                fontSize: 12,
                color: 'text.secondary',
              }}
            >
              <Box sx={{ flex: 1 }}>
                {props.viewCount} view{props.viewCount === 1 ? '' : 's'} since publishing
              </Box>
              <Button
                size="small"
                href={url}
                target="_blank"
                rel="noreferrer"
                endIcon={<OpenInNewIcon sx={{ fontSize: 14 }} />}
              >
                View site
              </Button>
            </Box>
          </>
        )}

        {props.isGuest && (
          <Box sx={{ mt: 1.5, fontSize: 12, color: 'text.secondary' }}>
            Guest pages live in this browser, so the link only opens here. Sign in with Google to
            share with anyone.
          </Box>
        )}
      </Popover>

      {/* Page options */}
      <Menu
        anchorEl={moreAnchor}
        open={Boolean(moreAnchor)}
        onClose={() => setMoreAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { width: 260 } } }}
      >
        <MenuItem onClick={props.onToggleFullWidth}>
          <SwapHorizIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Box sx={{ flex: 1 }}>Full width</Box>
          <Switch size="small" checked={props.fullWidth} tabIndex={-1} sx={{ my: -1, mr: -1 }} />
        </MenuItem>
        <MenuItem onClick={props.onToggleLock}>
          {props.locked ? (
            <LockIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          ) : (
            <LockOpenOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          )}
          <Box sx={{ flex: 1 }}>Lock page</Box>
          <Switch size="small" checked={props.locked} tabIndex={-1} sx={{ my: -1, mr: -1 }} />
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            setMoreAnchor(null)
            props.onDuplicate()
          }}
        >
          <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMoreAnchor(null)
            props.onExport()
          }}
        >
          <FileDownloadOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          Export as Markdown
        </MenuItem>
        <MenuItem
          onClick={() => {
            setMoreAnchor(null)
            props.onDelete()
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteOutlineIcon fontSize="small" />
          Delete page
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <Box sx={{ px: 1.5, py: 0.75, fontSize: 12, color: 'text.secondary', lineHeight: 1.6 }}>
          {props.wordCount.toLocaleString()} word{props.wordCount === 1 ? '' : 's'} ·{' '}
          {Math.max(1, Math.round(props.wordCount / 230))} min read
          {props.lastEdited && relativeTime(props.lastEdited) && (
            <>
              <br />
              Last edited {relativeTime(props.lastEdited)}
            </>
          )}
        </Box>
      </Menu>
    </Box>
  )
}

export default TopBar
