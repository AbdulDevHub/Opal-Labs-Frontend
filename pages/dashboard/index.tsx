import Head from 'next/head'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import AddIcon from '@mui/icons-material/Add'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined'
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Drawer from '@mui/material/Drawer'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import CommandPalette, { PaletteAction } from '@/components/Dashboard/CommandPalette'
import PageHeader from '@/components/Dashboard/PageHeader'
import ShortcutsDialog from '@/components/Dashboard/ShortcutsDialog'
import Sidebar from '@/components/Dashboard/Sidebar'
import TemplatePicker from '@/components/Dashboard/TemplatePicker'
import TopBar from '@/components/Dashboard/TopBar'
import Editor, { EditorHandle } from '@/components/Editor'
import ConfirmDialog, { ConfirmRequest } from '@/components/Shared/ConfirmDialog'
import { useColorMode } from '@/contexts/ColorMode'
import { useToast } from '@/contexts/Toast'
import { usePageCreate } from '@/hooks/Page/usePageCreate'
import { usePageDelete } from '@/hooks/Page/usePageDelete'
import { toPageName, usePageEditor } from '@/hooks/Page/usePageEditor'
import { PageType, usePageList } from '@/hooks/Page/usePageList'
import { usePageUpdate } from '@/hooks/Page/usePageUpdate'
import { useUserGet } from '@/hooks/User/useUserGet'
import { useUserLogout } from '@/hooks/User/useUserLogout'
import { countWords, downloadFile, toMarkdown } from '@/lib/blocks/markdown'
import { Block, BlockType, cloneBlocks } from '@/lib/blocks/types'
import { exitGuest, getDataSource, isGuest } from '@/lib/data/mode'
import { shortcut } from '@/lib/keys'
import { pageName, pathTo, withDescendants } from '@/lib/pages'

const SIDEBAR_KEY = 'opal-sidebar-open'
const PLANS = ['premium', 'enterprise', 'freemium']

/**
 * The workspace: sidebar with the page tree, and the selected page with its block editor.
 * Pages save automatically. Works signed in (backend) or as a guest (this browser only).
 */
const Dashboard = () => {
  const { data: session, status: sessionStatus } = useSession()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const colorMode = useColorMode()
  const { setToast } = useToast()

  const [isGuestMode, setIsGuestMode] = useState(false)
  const [pages, setPages] = usePageList()
  const [status, setStatus] = useState('premium')
  const userData = useUserGet(session?.userToken)
  const logoutUser = useUserLogout()
  const createRootPage = usePageCreate(pages, setPages, true)
  const createChildPage = usePageCreate(pages, setPages, false)
  const updatePage = usePageUpdate()
  const deletePage = usePageDelete()

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const [confirm, setConfirm] = useState<ConfirmRequest | null>(null)
  const [focusTitleFor, setFocusTitleFor] = useState<string | null>(null)

  const editorRef = useRef<EditorHandle>(null)
  const titleRef = useRef<HTMLTextAreaElement>(null)

  /* ------------------------------ access ------------------------------ */
  useEffect(() => {
    const guest = isGuest()
    setIsGuestMode(guest)
    if (sessionStatus === 'unauthenticated' && !guest) router.replace('/')
  }, [sessionStatus, router])

  useEffect(() => {
    if (userData?.status) setStatus(userData.status)
  }, [userData])

  useEffect(() => {
    try {
      setSidebarOpen(window.localStorage.getItem(SIDEBAR_KEY) !== 'false')
    } catch {
      // keep it open
    }
  }, [])

  /* ------------------------------ selected page (kept in the URL) ------------------------------ */
  const queryPage = typeof router.query.page === 'string' ? router.query.page : ''
  const selectedPageUuid = pages.some((p) => p.page_uuid === queryPage)
    ? queryPage
    : pages[0]?.page_uuid ?? ''

  const selectPage = useCallback(
    (pageUuid: string) => {
      setMobileOpen(false)
      if (pageUuid === queryPage) return
      router.push({ pathname: '/dashboard', query: { page: pageUuid } }, undefined, {
        shallow: true,
      })
    },
    [router, queryPage]
  )

  // Put the first page in the URL once pages load (or when the selected one disappears)
  useEffect(() => {
    if (router.isReady && pages.length && selectedPageUuid && queryPage !== selectedPageUuid) {
      router.replace({ pathname: '/dashboard', query: { page: selectedPageUuid } }, undefined, {
        shallow: true,
      })
    }
  }, [router, pages.length, selectedPageUuid, queryPage])

  const isUserBroke = status === 'freemium'
  const editor = usePageEditor(selectedPageUuid)
  const ready = !editor.isLoading && editor.meta?.pageUuid === selectedPageUuid
  const readOnly = Boolean(editor.etc.locked)

  // Keep the sidebar in step with the open page's title and icon
  useEffect(() => {
    if (!ready) return
    const name = toPageName(editor.title)
    setPages((prev) => {
      const current = prev.find((p) => p.page_uuid === selectedPageUuid)
      if (!current) return prev
      if (
        current.page_name === name &&
        JSON.stringify(current.etc ?? {}) === JSON.stringify(editor.etc)
      )
        return prev
      return prev.map((p) =>
        p.page_uuid === selectedPageUuid
          ? {
              ...p,
              page_name: name,
              etc: { ...editor.etc },
              last_updated_at: new Date().toISOString(),
            }
          : p
      )
    })
  }, [ready, editor.title, editor.etc, selectedPageUuid, setPages])

  const patchPage = useCallback(
    (pageUuid: string, changes: Partial<PageType>) =>
      setPages((prev) => prev.map((p) => (p.page_uuid === pageUuid ? { ...p, ...changes } : p))),
    [setPages]
  )

  /* ------------------------------ page actions ------------------------------ */
  const newPage = useCallback(async () => {
    const page = await createRootPage()
    if (!page) {
      setToast({ type: 'error', message: 'Couldn’t create a page. Please try again.' })
      return
    }
    setFocusTitleFor(page.page_uuid)
    selectPage(page.page_uuid)
  }, [createRootPage, selectPage, setToast])

  const toggleFavourite = (pageUuid: string) => {
    const page = pages.find((p) => p.page_uuid === pageUuid)
    if (!page) return
    const next = !page.is_favourite
    patchPage(pageUuid, { is_favourite: next })
    if (pageUuid === selectedPageUuid) editor.setFlags({ isFavourite: next })
    else updatePage(pageUuid, undefined, undefined, undefined, next)
  }

  const togglePublic = async () => {
    const next = !editor.meta?.isPublic
    patchPage(selectedPageUuid, { public_page: next })
    const ok = await editor.setFlags({ isPublic: next })
    setToast(
      ok
        ? {
            type: 'success',
            message: next ? 'Published! Anyone with the link can view it.' : 'Page unpublished',
          }
        : { type: 'error', message: 'Couldn’t update publishing. Please try again.' }
    )
  }

  const rename = (pageUuid: string, name: string) => {
    if (pageUuid === selectedPageUuid) {
      editor.setTitle(name === 'Untitled' ? '' : name)
      return
    }
    patchPage(pageUuid, { page_name: name })
    updatePage(pageUuid, name)
  }

  const duplicate = async (pageUuid: string) => {
    try {
      const source = pageUuid === selectedPageUuid ? null : await getDataSource().getPage(pageUuid)
      const name = `${source ? source.page.page_name : toPageName(editor.title)} (copy)`
      const etc = (source ? source.page.etc : editor.etc) ?? {}
      const blocks: Block[] = source
        ? source.elements.map((el) => ({
            element_uuid: el.element_uuid,
            type: el.type,
            content: el.content?.text ?? '',
            elementStyling: el.etc?.text ?? '',
          }))
        : editor.blocks
      const page = await createRootPage(undefined, name, etc as Record<string, unknown>)
      if (!page) throw new Error('create failed')
      // Sub-pages belong to the original, so their links aren't copied
      const copied = cloneBlocks(blocks.filter((b) => b.type !== BlockType.SubPage))
      await updatePage(
        page.page_uuid,
        name,
        true,
        copied,
        undefined,
        undefined,
        etc as Record<string, unknown>
      )
      selectPage(page.page_uuid)
      setToast({ type: 'success', message: `Duplicated “${pageName({ page_name: name })}”` })
    } catch {
      setToast({ type: 'error', message: 'Couldn’t duplicate the page.' })
    }
  }

  /** Deletes a page and its sub-pages after confirming */
  const requestDelete = (pageUuid: string, onDeleted?: () => void) => {
    const page = pages.find((p) => p.page_uuid === pageUuid)
    const subCount = withDescendants(pages, pageUuid).size - 1
    setConfirm({
      title: `Delete “${pageName(page)}”?`,
      body:
        subCount > 0
          ? `This also deletes ${subCount} sub-page${
              subCount === 1 ? '' : 's'
            }. This can’t be undone.`
          : 'This can’t be undone.',
      confirmLabel: 'Delete',
      danger: true,
      onConfirm: async () => {
        const removed = withDescendants(pages, pageUuid)
        if (removed.has(selectedPageUuid)) await editor.discard()
        const ok = await deletePage(pageUuid)
        if (!ok) {
          setToast({ type: 'error', message: 'Couldn’t delete the page.' })
          return
        }
        onDeleted?.()
        // Remove links to it from the open page
        editor.setBlocks((prev) =>
          prev.some((b) => b.type === BlockType.SubPage && removed.has(b.elementStyling))
            ? prev.filter((b) => !(b.type === BlockType.SubPage && removed.has(b.elementStyling)))
            : prev
        )
        const remaining = pages.filter((p) => !removed.has(p.page_uuid))
        setPages(remaining)
        if (removed.has(selectedPageUuid)) {
          const parent = page?.parent_page_uuid
          const next = remaining.find((p) => p.page_uuid === parent) ?? remaining[0]
          if (next) selectPage(next.page_uuid)
          else newPage()
        }
        setToast({ type: 'success', message: 'Page deleted' })
      },
    })
  }

  const createSubPage = async () => {
    const child = await createChildPage(selectedPageUuid)
    if (!child) setToast({ type: 'error', message: 'Couldn’t create the sub-page.' })
    return child?.page_uuid
  }

  const exportMarkdown = () => {
    const markdown = toMarkdown(
      toPageName(editor.title),
      editor.blocks,
      (uuid) => pageName(pages.find((p) => p.page_uuid === uuid)),
      editor.etc.icon
    )
    const slug = toPageName(editor.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    downloadFile(`${slug || 'page'}.md`, markdown)
  }

  const cycleStatus = () => {
    const next = PLANS[(PLANS.indexOf(status) + 1) % PLANS.length]
    setStatus(next)
    setToast({
      type: 'info',
      message: `Demo plan switched to ${
        next === 'freemium' ? 'Free' : next.charAt(0).toUpperCase() + next.slice(1)
      }`,
    })
  }

  const handleSignOut = async () => {
    await editor.save()
    if (isGuestMode) {
      exitGuest()
      router.push('/')
      return
    }
    await logoutUser()
    signOut({ callbackUrl: '/' })
  }

  const signInFromGuest = async () => {
    await editor.save()
    exitGuest()
    signIn('google')
  }

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileOpen((open) => !open)
      return
    }
    setSidebarOpen((open) => {
      try {
        window.localStorage.setItem(SIDEBAR_KEY, String(!open))
      } catch {
        // not saved
      }
      return !open
    })
  }, [isMobile])

  /* ------------------------------ global shortcuts ------------------------------ */
  const shortcutsRef = useRef({
    newPage,
    toggleSidebar,
    save: editor.save,
    toggleTheme: colorMode.toggle,
  })
  shortcutsRef.current = {
    newPage,
    toggleSidebar,
    save: editor.save,
    toggleTheme: colorMode.toggle,
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const mod = event.metaKey || event.ctrlKey
      if (!mod) return
      const key = event.key.toLowerCase()
      if (key === 'k') {
        event.preventDefault()
        setPaletteOpen((open) => !open)
      } else if (key === 's') {
        event.preventDefault()
        shortcutsRef.current.save()
      } else if (key === '\\') {
        event.preventDefault()
        shortcutsRef.current.toggleSidebar()
      } else if (key === '/') {
        event.preventDefault()
        setShortcutsOpen((open) => !open)
      } else if (event.altKey && (key === 'n' || event.code === 'KeyN')) {
        event.preventDefault()
        shortcutsRef.current.newPage()
      } else if (event.shiftKey && key === 'l') {
        event.preventDefault()
        shortcutsRef.current.toggleTheme()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const paletteActions: PaletteAction[] = [
      {
        id: 'new',
        label: 'New page',
        icon: <AddIcon />,
        hint: shortcut('mod', 'alt', 'N'),
        keywords: 'create add',
        run: newPage,
      },
      {
        id: 'theme',
        label: colorMode.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode',
        icon: <DarkModeOutlinedIcon />,
        hint: shortcut('mod', 'shift', 'L'),
        keywords: 'theme dark light',
        run: colorMode.toggle,
      },
      {
        id: 'sidebar',
        label: 'Toggle sidebar',
        icon: <ViewSidebarOutlinedIcon />,
        hint: shortcut('mod', '\\'),
        run: toggleSidebar,
      },
      {
        id: 'export',
        label: 'Export page as Markdown',
        icon: <FileDownloadOutlinedIcon />,
        keywords: 'download md',
        run: exportMarkdown,
      },
      {
        id: 'shortcuts',
        label: 'Keyboard shortcuts',
        icon: <KeyboardOutlinedIcon />,
        hint: shortcut('mod', '/'),
        keywords: 'help keys',
        run: () => setShortcutsOpen(true),
      },
  ]

  /* ------------------------------ render ------------------------------ */
  if (!isGuestMode && sessionStatus !== 'authenticated') return null

  const user = isGuestMode
    ? { name: 'Guest' }
    : {
        name: session?.user?.name || userData?.name || 'You',
        email: session?.user?.email || undefined,
        image: session?.user?.image || undefined,
      }

  const path = pathTo(pages, selectedPageUuid)
  const columnSx = {
    width: '100%',
    maxWidth: editor.etc.fullWidth ? 'none' : 820,
    mx: 'auto',
    px: { xs: 3, sm: 12 },
  }
  const showTemplates = ready && !readOnly && editor.blocks.length === 0
  const wordCount = countWords(editor.title, editor.blocks)

  const sidebar = (
    <Sidebar
      pages={pages}
      selectedPageUuid={selectedPageUuid}
      onSelect={selectPage}
      onNewPage={newPage}
      onSearch={() => setPaletteOpen(true)}
      onShortcuts={() => setShortcutsOpen(true)}
      onRename={rename}
      onToggleFavourite={toggleFavourite}
      onDuplicate={duplicate}
      onDelete={(uuid) => requestDelete(uuid)}
      onCollapse={isMobile ? () => setMobileOpen(false) : toggleSidebar}
      user={user}
      isGuest={isGuestMode}
      status={status}
      onCycleStatus={cycleStatus}
      onSignOut={handleSignOut}
      onSignIn={signInFromGuest}
    />
  )

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100dvh',
        backgroundColor: 'background.default',
        color: 'text.primary',
      }}
    >
      <Head>
        <title>{`${editor.etc.icon ? `${editor.etc.icon} ` : ''}${
          ready ? toPageName(editor.title) : 'Opal Labs'
        } · Opal Labs`}</title>
      </Head>

      {isMobile ? (
        <Drawer
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          PaperProps={{ sx: { border: 0 } }}
        >
          {sidebar}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: sidebarOpen ? 264 : 0,
            flexShrink: 0,
            overflow: 'hidden',
            transition: 'width 200ms ease',
          }}
        >
          {sidebar}
        </Box>
      )}

      <Box
        component="main"
        id="page-scroll"
        sx={{ flex: 1, minWidth: 0, overflowY: 'auto', overflowX: 'hidden', position: 'relative' }}
      >
        <TopBar
          path={path}
          onSelect={selectPage}
          onOpenSidebar={toggleSidebar}
          showSidebarButton={isMobile || !sidebarOpen}
          isMobile={isMobile}
          saveState={editor.saveState}
          onRetrySave={editor.save}
          pageUuid={selectedPageUuid}
          isFavourite={Boolean(pages.find((p) => p.page_uuid === selectedPageUuid)?.is_favourite)}
          onToggleFavourite={() => toggleFavourite(selectedPageUuid)}
          isPublic={Boolean(editor.meta?.isPublic)}
          onTogglePublic={togglePublic}
          viewCount={editor.meta?.viewCount ?? 0}
          canPublish={!isUserBroke || Boolean(editor.meta?.isPublic)}
          isGuest={isGuestMode}
          locked={readOnly}
          onToggleLock={() => editor.setEtc({ locked: !readOnly })}
          fullWidth={Boolean(editor.etc.fullWidth)}
          onToggleFullWidth={() => editor.setEtc({ fullWidth: !editor.etc.fullWidth })}
          onDuplicate={() => duplicate(selectedPageUuid)}
          onExport={exportMarkdown}
          onDelete={() => requestDelete(selectedPageUuid)}
          onCopied={(message) => setToast({ type: 'success', message })}
          wordCount={wordCount}
          lastEdited={editor.meta?.lastUpdatedAt}
        />

        {!ready ? (
          <Box sx={{ display: 'grid', placeItems: 'center', height: '60vh' }}>
            {editor.loadError ? (
              <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>🫥</Box>
                <Box sx={{ fontWeight: 600, color: 'text.primary' }}>
                  This page couldn’t be loaded
                </Box>
                <Box sx={{ fontSize: 14 }}>
                  {isGuestMode
                    ? 'It may have been deleted.'
                    : 'The server may be waking up. Give it a few seconds and refresh.'}
                </Box>
              </Box>
            ) : (
              <CircularProgress size={28} thickness={4} />
            )}
          </Box>
        ) : (
          <Box sx={{ pb: 4, animation: 'opalFadeIn 220ms ease' }} key={selectedPageUuid}>
            <PageHeader
              title={editor.title}
              onTitleChange={editor.setTitle}
              etc={editor.etc}
              onEtcChange={editor.setEtc}
              readOnly={readOnly}
              onTitleExit={() => editorRef.current?.focusStart()}
              autoFocusTitle={focusTitleFor === selectedPageUuid}
              titleRef={titleRef}
              columnSx={columnSx}
            />
            <Box sx={{ ...columnSx, mt: 1.5 }}>
              <Editor
                ref={editorRef}
                blocks={editor.blocks}
                setBlocks={editor.setBlocks}
                readOnly={readOnly}
                pages={pages}
                openPage={selectPage}
                createSubPage={createSubPage}
                requestDeleteSubPage={(uuid, onDeleted) => requestDelete(uuid, onDeleted)}
                dateViewCount={editor.meta?.dateViewCount ?? {}}
                isPublic={Boolean(editor.meta?.isPublic)}
                isUserBroke={isUserBroke}
                onExitTop={() => {
                  const el = titleRef.current
                  el?.focus()
                  el?.setSelectionRange(el.value.length, el.value.length)
                }}
              />
              {showTemplates && (
                <TemplatePicker
                  onPick={(template) => {
                    editor.setTitle(template.title)
                    editor.setEtc({ icon: template.icon, cover: template.cover })
                    editor.setBlocks(cloneBlocks(template.blocks))
                  }}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        pages={pages}
        actions={paletteActions}
        onSelectPage={selectPage}
      />
      <ShortcutsDialog open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
      <ConfirmDialog request={confirm} onClose={() => setConfirm(null)} />
    </Box>
  )
}

export default Dashboard
