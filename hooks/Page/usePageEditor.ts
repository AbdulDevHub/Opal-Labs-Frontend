import { useCallback, useEffect, useRef, useState } from 'react'

import { usePageUpdate } from '@/hooks/Page/usePageUpdate'
import { Block, PageEtc, parsePageEtc } from '@/lib/blocks/types'
import { getDataSource, isGuest } from '@/lib/data/mode'

export type SaveState = 'idle' | 'unsaved' | 'saving' | 'saved' | 'error'

type Loaded = {
  pageUuid: string
  isRoot: boolean
  isFavourite: boolean
  isPublic: boolean
  parentUuid: string | null
  dateViewCount: Record<string, number>
  viewCount: number
  lastUpdatedAt?: string
}

const AUTOSAVE_DELAY = 700

/** New pages are called "Untitled" in the database; show that as an empty title with a placeholder */
const toTitle = (pageName: string) => (pageName === 'Untitled' ? '' : pageName ?? '')
export const toPageName = (title: string) => title.trim() || 'Untitled'

/**
 * Loads one page for editing and saves changes automatically (debounced) through the data source.
 * Pending changes are flushed when switching to another page or leaving the site.
 *
 * Saves run one after another (never overlapping) so an older request can't land last.
 *
 * @param {string} pageUuid - The page to edit
 */
export const usePageEditor = (pageUuid: string) => {
  const updatePage = usePageUpdate()

  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [title, setTitleState] = useState('')
  const [blocks, setBlocksState] = useState<Block[]>([])
  const [etc, setEtcState] = useState<PageEtc>({})
  const [meta, setMeta] = useState<Loaded | null>(null)
  const [saveState, setSaveState] = useState<SaveState>('idle')

  // Latest values for saving from timers and cleanup callbacks
  const latest = useRef({ pageUuid, title, blocks, etc, isRoot: true })
  const dirty = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()
  const inFlight = useRef<Promise<boolean> | null>(null)
  // Pages being deleted: queued saves for them are dropped
  const discarded = useRef(new Set<string>())

  const save = useCallback(async (): Promise<boolean> => {
    if (timer.current) clearTimeout(timer.current)
    if (!dirty.current) return inFlight.current ?? true
    dirty.current = false
    // Snapshot now: by the time the previous save finishes another page may be open
    const snapshot = latest.current
    if (!snapshot.pageUuid) return true

    setSaveState('saving')
    const previous = inFlight.current
    const run = (async () => {
      if (previous) await previous
      if (discarded.current.has(snapshot.pageUuid)) return true
      return updatePage(
        snapshot.pageUuid,
        toPageName(snapshot.title),
        snapshot.isRoot,
        snapshot.blocks,
        undefined,
        undefined,
        snapshot.etc as Record<string, unknown>
      )
    })()
    inFlight.current = run
    const ok = await run
    if (inFlight.current === run) inFlight.current = null
    // Only report on the page that is still open
    if (latest.current.pageUuid === snapshot.pageUuid) {
      if (!ok) dirty.current = true
      setSaveState(ok ? (dirty.current ? 'unsaved' : 'saved') : 'error')
      if (ok) setMeta((m) => (m ? { ...m, lastUpdatedAt: new Date().toISOString() } : m))
    }
    return ok
  }, [updatePage])

  const scheduleSave = useCallback(() => {
    dirty.current = true
    setSaveState('unsaved')
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(save, AUTOSAVE_DELAY)
  }, [save])

  // Load the page (and flush the previous page's pending changes first)
  useEffect(() => {
    if (!pageUuid) return
    let cancelled = false
    setIsLoading(true)
    setLoadError(false)
    // Point at the new page straight away so nothing can be saved to (or flagged on) the old one
    latest.current = { pageUuid, title: '', blocks: [], etc: {}, isRoot: true }

    getDataSource()
      .getPage(pageUuid)
      .then((data) => {
        if (cancelled) return
        const page = data.page
        const loadedBlocks: Block[] = (data.elements ?? []).map((element) => ({
          element_uuid: element.element_uuid,
          type: element.type,
          content: element.content?.text ?? '',
          elementStyling: element.etc?.text ?? '',
        }))
        const loadedEtc = parsePageEtc(page.etc)
        latest.current = {
          pageUuid,
          title: toTitle(page.page_name),
          blocks: loadedBlocks,
          etc: loadedEtc,
          isRoot: page.is_root,
        }
        setTitleState(toTitle(page.page_name))
        setBlocksState(loadedBlocks)
        setEtcState(loadedEtc)
        setMeta({
          pageUuid,
          isRoot: page.is_root,
          isFavourite: page.is_favourite,
          isPublic: page.public_page,
          parentUuid: page.parent_page_uuid ?? null,
          dateViewCount: page.date_view_count ?? {},
          viewCount: page.view_count ?? 0,
          lastUpdatedAt: page.last_updated_at,
        })
        setSaveState('idle')
      })
      .catch((error) => {
        console.error(`Failed to load page: ${error}`)
        if (!cancelled) setLoadError(true)
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })

    return () => {
      cancelled = true
      // Save whatever is still pending for this page before the next one loads
      if (dirty.current) save()
    }
  }, [pageUuid, save])

  // Last-chance save when the tab closes; ask the browser to wait if a save can't finish in time
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty.current) return
      save()
      // Guest saves finish synchronously; backend saves may not, so let the browser ask
      if (!isGuest()) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [save])

  const setTitle = useCallback(
    (next: string) => {
      latest.current = { ...latest.current, title: next }
      setTitleState(next)
      scheduleSave()
    },
    [scheduleSave]
  )

  const setBlocks = useCallback(
    (next: Block[] | ((prev: Block[]) => Block[])) => {
      const value = typeof next === 'function' ? next(latest.current.blocks) : next
      latest.current = { ...latest.current, blocks: value }
      setBlocksState(value)
      scheduleSave()
    },
    [scheduleSave]
  )

  const setEtc = useCallback(
    (changes: Partial<PageEtc>) => {
      const value = { ...latest.current.etc, ...changes }
      // Drop cleared keys so the saved JSON stays tidy
      Object.keys(value).forEach((key) => {
        const k = key as keyof PageEtc
        if (value[k] === undefined || value[k] === false || value[k] === '') delete value[k]
      })
      latest.current = { ...latest.current, etc: value }
      setEtcState(value)
      scheduleSave()
    },
    [scheduleSave]
  )

  /** Favourite / publish are saved straight away (they don't touch the content) */
  const setFlags = useCallback(
    async (flags: { isFavourite?: boolean; isPublic?: boolean }) => {
      const uuid = latest.current.pageUuid
      setMeta((m) =>
        m
          ? {
              ...m,
              isFavourite: flags.isFavourite ?? m.isFavourite,
              isPublic: flags.isPublic ?? m.isPublic,
              ...(flags.isPublic !== undefined ? { dateViewCount: {}, viewCount: 0 } : {}),
            }
          : m
      )
      await save()
      return updatePage(uuid, undefined, undefined, undefined, flags.isFavourite, flags.isPublic)
    },
    [save, updatePage]
  )

  /** Drops pending changes (the page is about to be deleted) */
  const discard = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current)
    dirty.current = false
    discarded.current.add(latest.current.pageUuid)
    await inFlight.current
  }, [])

  return {
    discard,
    isLoading,
    loadError,
    title,
    setTitle,
    blocks,
    setBlocks,
    etc,
    setEtc,
    meta,
    setFlags,
    saveState,
    save,
  }
}

export type PageEditor = ReturnType<typeof usePageEditor>
