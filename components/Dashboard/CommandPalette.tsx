import { ReactNode, useEffect, useMemo, useRef, useState } from 'react'

import SearchIcon from '@mui/icons-material/Search'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import InputBase from '@mui/material/InputBase'

import type { PageType } from '@/hooks/Page/usePageList'
import { pageIcon, pageName, pathTo, relativeTime } from '@/lib/pages'

import PageIcon from './PageIcon'

export type PaletteAction = {
  id: string
  label: string
  icon: ReactNode
  hint?: string
  keywords?: string
  run: () => void
}

type Item =
  | { kind: 'page'; page: PageType; path: string }
  | { kind: 'action'; action: PaletteAction }

type Props = {
  open: boolean
  onClose: () => void
  pages: PageType[]
  actions: PaletteAction[]
  onSelectPage: (pageUuid: string) => void
}

/** Ctrl/⌘+K: jump to any page or run a command */
const CommandPalette = ({ open, onClose, pages, actions, onSelectPage }: Props) => {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      setQuery('')
      setActive(0)
    }
  }, [open])

  const items = useMemo<Item[]>(() => {
    const q = query.trim().toLowerCase()
    const pageItems = pages
      .map((page) => ({
        page,
        path: pathTo(pages, page.page_uuid)
          .slice(0, -1)
          .map((p) => pageName(p))
          .join(' / '),
        name: pageName(page).toLowerCase(),
      }))
      .filter(({ name, path }) => !q || name.includes(q) || path.toLowerCase().includes(q))
      .sort((a, b) =>
        q
          ? Number(b.name.startsWith(q)) - Number(a.name.startsWith(q))
          : (b.page.last_updated_at ?? '').localeCompare(a.page.last_updated_at ?? '')
      )
      .slice(0, q ? 20 : 6)
      .map(({ page, path }) => ({ kind: 'page' as const, page, path }))

    const actionItems = actions
      .filter(
        (action) => !q || `${action.label} ${action.keywords ?? ''}`.toLowerCase().includes(q)
      )
      .map((action) => ({ kind: 'action' as const, action }))

    return [...pageItems, ...actionItems]
  }, [query, pages, actions])

  useEffect(() => setActive(0), [query])
  useEffect(() => {
    listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const run = (item: Item | undefined) => {
    if (!item) return
    onClose()
    if (item.kind === 'page') onSelectPage(item.page.page_uuid)
    else item.action.run()
  }

  const firstAction = items.findIndex((item) => item.kind === 'action')

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ '& .MuiDialog-container': { alignItems: 'flex-start' } }}
      slotProps={{ backdrop: { sx: { backgroundColor: 'rgba(15,15,15,0.45)' } } }}
      PaperProps={{ sx: { mt: '12vh', borderRadius: 3, overflow: 'hidden' } }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
          px: 2,
          py: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <SearchIcon sx={{ color: 'text.secondary' }} />
        <InputBase
          autoFocus
          fullWidth
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search pages or type a command…"
          inputProps={{ 'aria-label': 'Search pages and commands' }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setActive((i) => Math.min(items.length - 1, i + 1))
            } else if (event.key === 'ArrowUp') {
              event.preventDefault()
              setActive((i) => Math.max(0, i - 1))
            } else if (event.key === 'Enter') {
              event.preventDefault()
              run(items[active])
            }
          }}
          sx={{ fontSize: 16 }}
        />
        <Box
          sx={{
            fontSize: 11,
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            px: 0.75,
            py: 0.25,
          }}
        >
          Esc
        </Box>
      </Box>

      <Box ref={listRef} role="listbox" sx={{ maxHeight: '55vh', overflowY: 'auto', p: 0.75 }}>
        {items.length === 0 && (
          <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary', fontSize: 14 }}>
            No results for “{query}”
          </Box>
        )}
        {items.map((item, index) => (
          <Box key={item.kind === 'page' ? item.page.page_uuid : item.action.id}>
            {(index === 0 || index === firstAction) && (
              <Box
                sx={{
                  px: 1.25,
                  pt: index === 0 ? 0.5 : 1.25,
                  pb: 0.5,
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {item.kind === 'page' ? (query ? 'Pages' : 'Recent pages') : 'Commands'}
              </Box>
            )}
            <Box
              role="option"
              aria-selected={index === active}
              data-index={index}
              onMouseMove={() => setActive(index)}
              onClick={() => run(item)}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1.25,
                px: 1.25,
                py: 1,
                borderRadius: 1.5,
                cursor: 'pointer',
                backgroundColor: index === active ? 'action.selected' : 'transparent',
              }}
            >
              {item.kind === 'page' ? (
                <>
                  <PageIcon icon={pageIcon(item.page)} />
                  <Box
                    sx={{ minWidth: 0, flex: 1, display: 'flex', alignItems: 'baseline', gap: 1 }}
                  >
                    <Box
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {pageName(item.page)}
                    </Box>
                    {item.path && (
                      <Box
                        sx={{
                          fontSize: 12,
                          color: 'text.secondary',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.path}
                      </Box>
                    )}
                  </Box>
                  <Box sx={{ fontSize: 12, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                    {relativeTime(item.page.last_updated_at)}
                  </Box>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      width: 22,
                      display: 'grid',
                      placeItems: 'center',
                      color: 'text.secondary',
                      '& svg': { fontSize: 18 },
                    }}
                  >
                    {item.action.icon}
                  </Box>
                  <Box sx={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{item.action.label}</Box>
                  {item.action.hint && (
                    <Box sx={{ fontSize: 12, color: 'text.secondary' }}>{item.action.hint}</Box>
                  )}
                </>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Dialog>
  )
}

export default CommandPalette
