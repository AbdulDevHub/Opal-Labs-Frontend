import { MouseEvent, ReactNode, useEffect, useMemo, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import GoogleIcon from '@mui/icons-material/Google'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import LogoutIcon from '@mui/icons-material/Logout'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import SearchIcon from '@mui/icons-material/Search'
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined'
import StarIcon from '@mui/icons-material/Star'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonBase from '@mui/material/ButtonBase'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'

import { ColorPreference, useColorMode } from '@/contexts/ColorMode'
import type { PageType } from '@/hooks/Page/usePageList'
import { BACKSLASH, shortcut } from '@/lib/keys'
import { childrenOf, isTopLevel, pageIcon, pageName, pathTo } from '@/lib/pages'

import PageIcon from './PageIcon'

export type SidebarProps = {
  pages: PageType[]
  selectedPageUuid: string
  onSelect: (pageUuid: string) => void
  onNewPage: () => void
  onSearch: () => void
  onShortcuts: () => void
  onRename: (pageUuid: string, name: string) => void
  onToggleFavourite: (pageUuid: string) => void
  onDuplicate: (pageUuid: string) => void
  onDelete: (pageUuid: string) => void
  onCollapse?: () => void
  user: { name: string; email?: string; image?: string }
  isGuest: boolean
  status: string
  onCycleStatus: () => void
  onSignOut: () => void
  onSignIn: () => void
}

const EXPANDED_KEY = 'opal-sidebar-expanded'

const PLAN_STYLES: Record<string, { label: string; color: string; background: string }> = {
  freemium: { label: 'Free', color: '#787774', background: 'rgba(120,119,116,0.16)' },
  premium: { label: 'Premium', color: '#B7791F', background: 'rgba(234,179,8,0.18)' },
  enterprise: { label: 'Enterprise', color: '#8B5CF6', background: 'rgba(139,92,246,0.16)' },
}

/** One clickable row in the sidebar */
const Row = ({
  icon,
  label,
  hint,
  onClick,
  selected = false,
  depth = 0,
  children,
}: {
  icon: ReactNode
  label: ReactNode
  hint?: string
  onClick: () => void
  selected?: boolean
  depth?: number
  children?: ReactNode
}) => (
  <Box
    sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      borderRadius: 1.5,
      mx: 0.75,
      color: selected ? 'text.primary' : 'sidebar.text',
      backgroundColor: selected ? 'sidebar.selected' : 'transparent',
      '&:hover': { backgroundColor: selected ? 'sidebar.selected' : 'sidebar.hover' },
      '&:hover .row-actions, &:focus-within .row-actions': { opacity: 1 },
    }}
  >
    <ButtonBase
      onClick={onClick}
      aria-current={selected ? 'page' : undefined}
      sx={{
        flex: 1,
        minWidth: 0,
        height: 30,
        justifyContent: 'flex-start',
        gap: 0.75,
        pl: `${8 + depth * 14}px`,
        pr: 1,
        fontSize: 14,
        fontWeight: selected ? 600 : 500,
        borderRadius: 1.5,
        textAlign: 'left',
      }}
    >
      {icon}
      <Box
        component="span"
        sx={{
          flex: 1,
          minWidth: 0,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Box>
      {hint && (
        <Box component="span" sx={{ fontSize: 11, opacity: 0.6, fontWeight: 500 }}>
          {hint}
        </Box>
      )}
    </ButtonBase>
    {children}
  </Box>
)

const SectionLabel = ({ children, action }: { children: string; action?: ReactNode }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      px: 2,
      pt: 2,
      pb: 0.5,
      fontSize: 12,
      fontWeight: 600,
      color: 'text.secondary',
      '&:hover .section-action': { opacity: 1 },
    }}
  >
    <Box sx={{ flex: 1 }}>{children}</Box>
    {action}
  </Box>
)

/**
 * The left navigation: account menu, search, new page, favourites and the nested page tree.
 */
const Sidebar = (props: SidebarProps) => {
  const { pages, selectedPageUuid, onSelect } = props
  const { preference, setPreference } = useColorMode()

  const [accountAnchor, setAccountAnchor] = useState<HTMLElement | null>(null)
  const [pageMenu, setPageMenu] = useState<{ pageUuid: string; anchor: HTMLElement } | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  const byId = useMemo(() => new Map(pages.map((page) => [page.page_uuid, page])), [pages])
  const topLevel = pages.filter((page) => isTopLevel(page, byId))
  const favourites = pages.filter((page) => page.is_favourite)

  // Remember which branches are open
  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem(EXPANDED_KEY) ?? '[]')
      if (Array.isArray(saved)) setExpanded(new Set(saved))
    } catch {
      // nothing saved
    }
  }, [])

  const setExpandedAndSave = (next: Set<string>) => {
    setExpanded(next)
    try {
      window.localStorage.setItem(EXPANDED_KEY, JSON.stringify(Array.from(next)))
    } catch {
      // not saved
    }
  }

  // Open the branches above the selected page
  useEffect(() => {
    const ancestors = pathTo(pages, selectedPageUuid).slice(0, -1)
    if (ancestors.some((page) => !expanded.has(page.page_uuid))) {
      const next = new Set(expanded)
      ancestors.forEach((page) => next.add(page.page_uuid))
      setExpanded(next)
    }
  }, [selectedPageUuid, pages]) // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (pageUuid: string, event: MouseEvent) => {
    event.stopPropagation()
    const next = new Set(expanded)
    if (next.has(pageUuid)) next.delete(pageUuid)
    else next.add(pageUuid)
    setExpandedAndSave(next)
  }

  const renderPage = (page: PageType, depth: number, inFavourites = false): ReactNode => {
    const children = inFavourites ? [] : childrenOf(pages, page.page_uuid)
    const isOpen = expanded.has(page.page_uuid)
    const isRenaming = renaming === page.page_uuid && !inFavourites

    return (
      <Box key={`${inFavourites ? 'fav' : 'tree'}-${page.page_uuid}`}>
        <Row
          depth={depth}
          selected={page.page_uuid === selectedPageUuid}
          onClick={() => onSelect(page.page_uuid)}
          icon={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {!inFavourites && (
                <Box
                  component="span"
                  role="button"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  onClick={(event) => children.length && toggle(page.page_uuid, event)}
                  sx={{
                    width: 18,
                    height: 18,
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: 0.75,
                    visibility: children.length ? 'visible' : 'hidden',
                    '&:hover': { backgroundColor: 'action.selected' },
                  }}
                >
                  <ChevronRightIcon
                    sx={{
                      fontSize: 16,
                      transition: 'transform 150ms',
                      transform: isOpen ? 'rotate(90deg)' : 'none',
                    }}
                  />
                </Box>
              )}
              <PageIcon icon={pageIcon(page)} />
            </Box>
          }
          label={
            isRenaming ? (
              <InputBase
                autoFocus
                defaultValue={page.page_name}
                onClick={(event) => event.stopPropagation()}
                onFocus={(event) => event.target.select()}
                onBlur={(event) => {
                  props.onRename(page.page_uuid, event.target.value.trim() || 'Untitled')
                  setRenaming(null)
                }}
                onKeyDown={(event) => {
                  event.stopPropagation()
                  if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
                  if (event.key === 'Escape') setRenaming(null)
                }}
                inputProps={{ 'aria-label': 'Page name' }}
                sx={{ fontSize: 14, height: 22, width: '100%', '& input': { p: 0 } }}
              />
            ) : (
              pageName(page)
            )
          }
        >
          <Box className="row-actions" sx={{ opacity: 0, transition: 'opacity 100ms', pr: 0.5 }}>
            <IconButton
              size="small"
              aria-label={`Options for ${pageName(page)}`}
              onClick={(event) =>
                setPageMenu({ pageUuid: page.page_uuid, anchor: event.currentTarget })
              }
              sx={{ width: 22, height: 22, color: 'inherit' }}
            >
              <MoreHorizIcon sx={{ fontSize: 17 }} />
            </IconButton>
          </Box>
        </Row>
        {!inFavourites && isOpen && children.length > 0 && (
          <Box>{children.map((child) => renderPage(child, depth + 1))}</Box>
        )}
        {!inFavourites && isOpen && children.length === 0 && null}
      </Box>
    )
  }

  const menuPage = pageMenu ? byId.get(pageMenu.pageUuid) : undefined
  const plan = PLAN_STYLES[props.status] ?? PLAN_STYLES.premium
  const themeOptions: { value: ColorPreference; label: string; icon: ReactNode }[] = [
    { value: 'light', label: 'Light', icon: <LightModeOutlinedIcon fontSize="small" /> },
    { value: 'dark', label: 'Dark', icon: <DarkModeOutlinedIcon fontSize="small" /> },
    { value: 'system', label: 'System', icon: <SettingsBrightnessOutlinedIcon fontSize="small" /> },
  ]

  return (
    <Box
      component="nav"
      aria-label="Pages"
      sx={{
        width: 264,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'sidebar.background',
        borderRight: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Account */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          p: 1,
          pb: 0.5,
          '&:hover .collapse-button': { opacity: 1 },
        }}
      >
        <ButtonBase
          onClick={(event) => setAccountAnchor(event.currentTarget)}
          aria-label="Account menu"
          sx={{
            flex: 1,
            minWidth: 0,
            justifyContent: 'flex-start',
            gap: 1,
            p: 0.75,
            borderRadius: 1.5,
            '&:hover': { backgroundColor: 'sidebar.hover' },
          }}
        >
          <Avatar
            src={props.user.image}
            alt={props.user.name}
            sx={{
              width: 24,
              height: 24,
              fontSize: 12,
              fontWeight: 700,
              bgcolor: 'primary.main',
              borderRadius: 1.25,
            }}
            variant="rounded"
          >
            {props.user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0, textAlign: 'left', flex: 1 }}>
            <Box
              sx={{
                fontSize: 14,
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {props.user.name}
            </Box>
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: 10,
              fontWeight: 700,
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              color: plan.color,
              backgroundColor: plan.background,
              letterSpacing: '0.02em',
            }}
          >
            {plan.label}
          </Box>
          <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
        </ButtonBase>
        {props.onCollapse && (
          <Tooltip title={`Close sidebar (${shortcut('mod', BACKSLASH)})`}>
            <IconButton
              className="collapse-button"
              aria-label="Close sidebar"
              onClick={props.onCollapse}
              sx={{
                opacity: { xs: 1, md: 0 },
                transition: 'opacity 120ms',
                color: 'text.secondary',
              }}
            >
              <KeyboardDoubleArrowLeftIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      <Row
        icon={<SearchIcon sx={{ fontSize: 18, mx: '2px' }} />}
        label="Search"
        hint={shortcut('mod', 'K')}
        onClick={props.onSearch}
      />
      <Row
        icon={<AddIcon sx={{ fontSize: 18, mx: '2px' }} />}
        label="New page"
        hint={shortcut('mod', 'alt', 'N')}
        onClick={props.onNewPage}
      />

      <Box sx={{ flex: 1, overflowY: 'auto', pb: 2 }}>
        {favourites.length > 0 && (
          <>
            <SectionLabel>Favourites</SectionLabel>
            {favourites.map((page) => renderPage(page, 0, true))}
          </>
        )}

        <SectionLabel
          action={
            <Tooltip title="Add a page">
              <IconButton
                className="section-action"
                size="small"
                aria-label="Add a page"
                onClick={props.onNewPage}
                sx={{ width: 20, height: 20, opacity: 0.6 }}
              >
                <AddIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          }
        >
          Pages
        </SectionLabel>
        {topLevel.map((page) => renderPage(page, 0))}
        {pages.length === 0 && (
          <Box sx={{ px: 2.5, py: 1, fontSize: 13, color: 'text.secondary' }}>Loading pages…</Box>
        )}
      </Box>

      {/* Guest notice */}
      {props.isGuest && (
        <Box
          sx={{
            m: 1.25,
            p: 1.5,
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Box sx={{ fontSize: 13, fontWeight: 600, mb: 0.25 }}>
            Guest mode: saved in this browser
          </Box>
          <Box sx={{ fontSize: 12, color: 'text.secondary', mb: 1.25 }}>
            Sign in with Google to keep pages in your account and share them with anyone.
          </Box>
          <Button
            fullWidth
            size="small"
            variant="contained"
            startIcon={<GoogleIcon fontSize="small" />}
            onClick={props.onSignIn}
          >
            Sign in with Google
          </Button>
        </Box>
      )}

      <Divider />
      <Box sx={{ py: 0.75 }}>
        <Row
          icon={<KeyboardOutlinedIcon sx={{ fontSize: 18, mx: '2px' }} />}
          label="Keyboard shortcuts"
          hint={shortcut('mod', '/')}
          onClick={props.onShortcuts}
        />
      </Box>

      {/* Account menu */}
      <Menu
        anchorEl={accountAnchor}
        open={Boolean(accountAnchor)}
        onClose={() => setAccountAnchor(null)}
        slotProps={{ paper: { sx: { width: 260 } } }}
      >
        <Box sx={{ px: 1.5, py: 1 }}>
          <Box sx={{ fontWeight: 600, fontSize: 14 }}>{props.user.name}</Box>
          {props.user.email && (
            <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{props.user.email}</Box>
          )}
        </Box>
        <Tooltip title="Demo only: switch plans to try what each one unlocks" placement="right">
          <MenuItem onClick={props.onCycleStatus}>
            <Box sx={{ flex: 1 }}>Plan</Box>
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: 700,
                px: 0.75,
                py: 0.25,
                borderRadius: 1,
                color: plan.color,
                backgroundColor: plan.background,
              }}
            >
              {plan.label}
            </Box>
            <Box sx={{ fontSize: 11, color: 'text.secondary' }}>switch</Box>
          </MenuItem>
        </Tooltip>
        <Divider sx={{ my: 0.5 }} />
        <Box
          sx={{
            px: 1.5,
            pt: 0.5,
            pb: 0.25,
            fontSize: 11,
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
          }}
        >
          Theme
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5, px: 1, pb: 0.75 }}>
          {themeOptions.map((option) => (
            <ButtonBase
              key={option.value}
              onClick={() => setPreference(option.value)}
              aria-pressed={preference === option.value}
              sx={{
                flex: 1,
                flexDirection: 'column',
                gap: 0.25,
                py: 0.75,
                fontSize: 12,
                borderRadius: 1.5,
                border: '1px solid',
                borderColor: preference === option.value ? 'primary.main' : 'divider',
                color: preference === option.value ? 'primary.main' : 'text.secondary',
              }}
            >
              {option.icon}
              {option.label}
            </ButtonBase>
          ))}
        </Box>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem
          onClick={() => {
            setAccountAnchor(null)
            props.onSignOut()
          }}
        >
          <LogoutIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          {props.isGuest ? 'Leave guest mode' : 'Sign out'}
        </MenuItem>
      </Menu>

      {/* Page options */}
      <Menu
        anchorEl={pageMenu?.anchor}
        open={Boolean(pageMenu && menuPage)}
        onClose={() => setPageMenu(null)}
        slotProps={{ paper: { sx: { width: 220 } } }}
      >
        {menuPage && [
          <MenuItem
            key="favourite"
            onClick={() => {
              props.onToggleFavourite(menuPage.page_uuid)
              setPageMenu(null)
            }}
          >
            {menuPage.is_favourite ? (
              <StarIcon fontSize="small" sx={{ color: '#E9B949' }} />
            ) : (
              <StarBorderIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            )}
            {menuPage.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
          </MenuItem>,
          <MenuItem
            key="rename"
            onClick={() => {
              setRenaming(menuPage.page_uuid)
              setPageMenu(null)
            }}
          >
            <DriveFileRenameOutlineIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            Rename
          </MenuItem>,
          <MenuItem
            key="duplicate"
            onClick={() => {
              props.onDuplicate(menuPage.page_uuid)
              setPageMenu(null)
            }}
          >
            <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            Duplicate
          </MenuItem>,
          <Divider key="divider" sx={{ my: 0.5 }} />,
          <MenuItem
            key="delete"
            onClick={() => {
              props.onDelete(menuPage.page_uuid)
              setPageMenu(null)
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteOutlineIcon fontSize="small" />
            Delete
          </MenuItem>,
        ]}
      </Menu>
    </Box>
  )
}

export default Sidebar
