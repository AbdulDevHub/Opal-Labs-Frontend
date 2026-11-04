import {
  forwardRef,
  KeyboardEvent,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'

import Box from '@mui/material/Box'

import type { PageType } from '@/hooks/Page/usePageList'
import { BlockOption, filterOptions } from '@/lib/blocks/registry'
import { parseTextStyle, TextStyle, updateTextStyle } from '@/lib/blocks/styling'
import {
  Block,
  BlockType,
  isFocusableType,
  isTextType,
  LIST_TYPES,
  newBlock,
} from '@/lib/blocks/types'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { v4 as uuidv4 } from 'uuid'

import BlockMenu from './BlockMenu'
import BlockRenderer, { listNumbers } from './BlockRenderer'
import { BlockShell, StaticBlockShell } from './BlockShell'
import { EditorContext, EditorContextValue } from './context'
import SlashMenu from './SlashMenu'

type Props = {
  blocks: Block[]
  setBlocks: (next: Block[] | ((prev: Block[]) => Block[])) => void
  readOnly: boolean
  pages: PageType[]
  openPage: (pageUuid: string) => void
  /** Creates a child page and returns its id */
  createSubPage: () => Promise<string | undefined>
  /** Asks the user to confirm deleting a sub-page; `onDeleted` removes the block */
  requestDeleteSubPage: (pageUuid: string, onDeleted: () => void) => void
  dateViewCount: Record<string, number>
  isPublic: boolean
  isUserBroke: boolean
  /** ArrowUp in the first block moves to the page title */
  onExitTop?: () => void
}

export type EditorHandle = {
  /** Focuses the first block, adding an empty paragraph when needed */
  focusStart: () => void
}

type FocusTarget = { id: string; pos: 'start' | 'end' | number }
type SlashState = { blockId: string; query: string; active: number }

// Markdown-style shortcuts typed at the start of a paragraph
const SHORTCUTS: Record<string, string> = {
  '#': BlockType.H1,
  '##': BlockType.H2,
  '###': BlockType.H3,
  '-': BlockType.Bulleted,
  '*': BlockType.Bulleted,
  '+': BlockType.Bulleted,
  '1.': BlockType.Numbered,
  '1)': BlockType.Numbered,
  '[]': BlockType.Todo,
  '[ ]': BlockType.Todo,
  '>': BlockType.Quote,
}
const SHORTCUT_PATTERN = /^(###|##|#|[-*+]|1[.)]|\[ ?\]|>)\s/

const lineHeightOf = (el: HTMLTextAreaElement) =>
  parseFloat(window.getComputedStyle(el).lineHeight) || 24
const isSingleLine = (el: HTMLTextAreaElement) => el.scrollHeight <= lineHeightOf(el) * 1.6

const caretOnFirstLine = (el: HTMLTextAreaElement) => {
  const pos = el.selectionStart
  if (pos !== el.selectionEnd || el.value.slice(0, pos).includes('\n')) return false
  return pos === 0 || isSingleLine(el) || el.value.includes('\n')
}

const caretOnLastLine = (el: HTMLTextAreaElement) => {
  const pos = el.selectionEnd
  if (pos !== el.selectionStart || el.value.slice(pos).includes('\n')) return false
  return pos === el.value.length || isSingleLine(el) || el.value.includes('\n')
}

/**
 * The block editor: renders blocks, handles typing shortcuts, the slash menu,
 * keyboard navigation between blocks, drag and drop and the block menu.
 */
const Editor = forwardRef<EditorHandle, Props>(function Editor(props, ref) {
  const {
    blocks,
    setBlocks,
    readOnly,
    pages,
    openPage,
    createSubPage,
    requestDeleteSubPage,
    dateViewCount,
    isPublic,
    isUserBroke,
    onExitTop,
  } = props

  const blocksRef = useRef(blocks)
  blocksRef.current = blocks

  const inputs = useRef(new Map<string, HTMLTextAreaElement>())
  const pendingFocus = useRef<FocusTarget | null>(null)
  const [slash, setSlash] = useState<SlashState | null>(null)
  const [menu, setMenu] = useState<{ blockId: string; anchor: HTMLElement } | null>(null)
  const [autoFocusId, setAutoFocusId] = useState<string | null>(null)

  /* ------------------------------ focus helpers ------------------------------ */
  const applyPendingFocus = useCallback(() => {
    const target = pendingFocus.current
    if (!target) return
    const el = inputs.current.get(target.id)
    if (!el) return
    pendingFocus.current = null
    el.focus({ preventScroll: false })
    const pos = target.pos === 'start' ? 0 : target.pos === 'end' ? el.value.length : target.pos
    el.setSelectionRange(pos, pos)
  }, [])

  const focusBlock = useCallback(
    (id: string, pos: FocusTarget['pos'] = 'end') => {
      // Applied after the next render (the block may be about to change) or on the next frame
      pendingFocus.current = { id, pos }
      requestAnimationFrame(applyPendingFocus)
    },
    [applyPendingFocus]
  )

  // New blocks mount after a state update; focus them once they exist
  useEffect(() => {
    applyPendingFocus()
  })

  const neighbour = (index: number, direction: 1 | -1) => {
    const list = blocksRef.current
    for (let i = index + direction; i >= 0 && i < list.length; i += direction) {
      if (isFocusableType(list[i].type)) return list[i]
    }
    return undefined
  }

  /* ------------------------------ block changes ------------------------------ */
  const updateBlock = useCallback(
    (id: string, changes: Partial<Block>) =>
      setBlocks((prev) => prev.map((b) => (b.element_uuid === id ? { ...b, ...changes } : b))),
    [setBlocks]
  )

  const insertAfter = (id: string | null, ...added: Block[]) =>
    setBlocks((prev) => {
      const next = [...prev]
      const index = id ? next.findIndex((b) => b.element_uuid === id) : -1
      next.splice(index + 1, 0, ...added)
      return next
    })

  const removeBlock = (id: string, focusPrevious = true) => {
    const index = blocksRef.current.findIndex((b) => b.element_uuid === id)
    const previous = neighbour(index, -1)
    setBlocks((prev) => prev.filter((b) => b.element_uuid !== id))
    if (focusPrevious && previous) focusBlock(previous.element_uuid, 'end')
  }

  const turnInto = async (block: Block, type: string, clearContent = false) => {
    const id = block.element_uuid
    const content = clearContent ? '' : block.content

    if (isFocusableType(type)) {
      const elementStyling =
        type === BlockType.Callout
          ? block.type === BlockType.Callout
            ? block.elementStyling
            : '💡'
          : isTextType(block.type)
          ? updateTextStyle(block.elementStyling, { checked: false })
          : 'normal'
      updateBlock(id, { type, content, elementStyling })
      focusBlock(id, 'end')
      return
    }

    if (type === BlockType.SubPage) {
      updateBlock(id, { content })
      const childUuid = await createSubPage()
      if (!childUuid) return
      const isLast = blocksRef.current[blocksRef.current.length - 1]?.element_uuid === id
      setBlocks((prev) => {
        const next = prev.map((b) =>
          b.element_uuid === id
            ? { element_uuid: id, type, content: 'Untitled', elementStyling: childUuid }
            : b
        )
        return isLast ? [...next, newBlock(BlockType.Paragraph)] : next
      })
      return
    }

    const replacement = { ...newBlock(type), element_uuid: id }
    if (type === BlockType.Divider) {
      const paragraph = newBlock(BlockType.Paragraph)
      setBlocks((prev) => {
        const index = prev.findIndex((b) => b.element_uuid === id)
        const next = [...prev]
        next.splice(index, 1, replacement, paragraph)
        return next
      })
      focusBlock(paragraph.element_uuid, 'start')
      return
    }

    setBlocks((prev) => prev.map((b) => (b.element_uuid === id ? replacement : b)))
    setAutoFocusId(id)
  }

  const setStyle = (id: string, changes: Partial<TextStyle>) => {
    const block = blocksRef.current.find((b) => b.element_uuid === id)
    if (block && isTextType(block.type))
      updateBlock(id, { elementStyling: updateTextStyle(block.elementStyling, changes) })
  }

  const duplicate = (id: string) => {
    const block = blocksRef.current.find((b) => b.element_uuid === id)
    if (!block || block.type === BlockType.SubPage) return
    const copy = { ...block, element_uuid: uuidv4() }
    insertAfter(id, copy)
    if (isFocusableType(copy.type)) focusBlock(copy.element_uuid, 'end')
  }

  const move = (id: string, delta: number) =>
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.element_uuid === id)
      const to = from + delta
      if (from < 0 || to < 0 || to >= prev.length) return prev
      return arrayMove(prev, from, to)
    })

  const deleteBlock = (id: string) => {
    const block = blocksRef.current.find((b) => b.element_uuid === id)
    if (!block) return
    if (block.type === BlockType.SubPage && block.elementStyling) {
      requestDeleteSubPage(block.elementStyling, () => removeBlock(id, false))
      return
    }
    removeBlock(id)
  }

  /** "+" in the gutter: a new line with the slash menu open (reuses an empty paragraph) */
  const addBelow = (id: string) => {
    const block = blocksRef.current.find((b) => b.element_uuid === id)
    if (block && block.type === BlockType.Paragraph && block.content === '') {
      updateBlock(id, { content: '/' })
      setSlash({ blockId: id, query: '', active: 0 })
      focusBlock(id, 'end')
      return
    }
    const added = newBlock(BlockType.Paragraph, '/')
    insertAfter(id, added)
    setSlash({ blockId: added.element_uuid, query: '', active: 0 })
    focusBlock(added.element_uuid, 'end')
  }

  /** Clicking under the last block continues the page */
  const addTrailing = () => {
    const last = blocksRef.current[blocksRef.current.length - 1]
    if (last && last.type === BlockType.Paragraph && last.content === '') {
      focusBlock(last.element_uuid, 'end')
      return
    }
    const added = newBlock(BlockType.Paragraph)
    setBlocks((prev) => [...prev, added])
    focusBlock(added.element_uuid, 'start')
  }

  useImperativeHandle(ref, () => ({
    focusStart: () => {
      const first = blocksRef.current[0]
      if (first && isFocusableType(first.type)) {
        focusBlock(first.element_uuid, 'start')
        return
      }
      const added = newBlock(BlockType.Paragraph)
      setBlocks((prev) => [added, ...prev])
      focusBlock(added.element_uuid, 'start')
    },
  }))

  /* ------------------------------ slash menu ------------------------------ */
  const slashOptions = useMemo(() => (slash ? filterOptions(slash.query) : []), [slash])

  const chooseSlash = (option: BlockOption) => {
    const block = blocksRef.current.find((b) => b.element_uuid === slash?.blockId)
    setSlash(null)
    if (block) turnInto(block, option.type, true)
  }

  /* ------------------------------ text handlers ------------------------------ */
  const onTextChange = (block: Block, value: string) => {
    const id = block.element_uuid

    if (block.type === BlockType.Paragraph) {
      const match = value.match(SHORTCUT_PATTERN)
      if (match && !block.content.match(SHORTCUT_PATTERN)) {
        const el = inputs.current.get(id)
        const caret = Math.max(0, (el?.selectionStart ?? match[0].length) - match[0].length)
        updateBlock(id, { type: SHORTCUTS[match[1]], content: value.slice(match[0].length) })
        setSlash(null)
        focusBlock(id, caret)
        return
      }
      if (value === '---' || value === '***') {
        turnInto({ ...block, content: '' }, BlockType.Divider, true)
        return
      }
      if (value === '```') {
        turnInto(block, BlockType.Code, true)
        return
      }
    }

    updateBlock(id, { content: value })

    // "/" typed into an empty block opens the menu; it stays open while the text is a command
    const isCommand = value.startsWith('/') && !value.includes('\n') && value.length <= 24
    if (block.content === '' && value === '/') setSlash({ blockId: id, query: '', active: 0 })
    else if (slash?.blockId === id) {
      if (!isCommand) setSlash(null)
      else setSlash({ blockId: id, query: value.slice(1), active: 0 })
    }
  }

  const onTextKeyDown = (event: KeyboardEvent<HTMLElement>, block: Block) => {
    const el = event.currentTarget as unknown as HTMLTextAreaElement
    const id = block.element_uuid
    const index = blocksRef.current.findIndex((b) => b.element_uuid === id)
    const mod = event.metaKey || event.ctrlKey
    const key = event.key

    // Slash menu navigation
    if (slash && slash.blockId === id) {
      const count = Math.max(slashOptions.length, 1)
      if (key === 'ArrowDown' || key === 'ArrowUp') {
        event.preventDefault()
        const step = key === 'ArrowDown' ? 1 : -1
        setSlash({ ...slash, active: (slash.active + step + count) % count })
        return
      }
      if (key === 'Enter' || key === 'Tab') {
        event.preventDefault()
        const option = slashOptions[slash.active]
        if (option) chooseSlash(option)
        else setSlash(null)
        return
      }
      if (key === 'Escape') {
        event.preventDefault()
        setSlash(null)
        return
      }
    }

    if (
      mod &&
      !event.shiftKey &&
      ['b', 'i', 'u'].includes(key.toLowerCase()) &&
      isTextType(block.type)
    ) {
      event.preventDefault()
      const flag = ({ b: 'bold', i: 'italic', u: 'underline' } as const)[
        key.toLowerCase() as 'b' | 'i' | 'u'
      ]
      setStyle(id, { [flag]: !parseTextStyle(block.elementStyling)[flag] })
      return
    }

    if (mod && key.toLowerCase() === 'd') {
      event.preventDefault()
      duplicate(id)
      return
    }

    if (mod && event.shiftKey && (key === 'ArrowUp' || key === 'ArrowDown')) {
      event.preventDefault()
      move(id, key === 'ArrowUp' ? -1 : 1)
      requestAnimationFrame(() => el.focus())
      return
    }

    if (key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      const value = el.value
      // Enter on an empty list item ends the list
      if (LIST_TYPES.includes(block.type) && value === '') {
        updateBlock(id, {
          type: BlockType.Paragraph,
          elementStyling: updateTextStyle(block.elementStyling, { checked: false }),
        })
        return
      }
      const before = value.slice(0, el.selectionStart)
      const after = value.slice(el.selectionEnd)
      const continues = LIST_TYPES.includes(block.type)
      const added = newBlock(
        continues ? block.type : BlockType.Paragraph,
        after,
        continues ? updateTextStyle(block.elementStyling, { checked: false }) : undefined
      )
      setBlocks((prev) => {
        const next = prev.map((b) => (b.element_uuid === id ? { ...b, content: before } : b))
        next.splice(index + 1, 0, added)
        return next
      })
      focusBlock(added.element_uuid, 'start')
      return
    }

    if (key === 'Backspace' && el.selectionStart === 0 && el.selectionEnd === 0) {
      // Headings, lists and quotes turn back into text first, like in Notion
      if (isTextType(block.type) && block.type !== BlockType.Paragraph) {
        event.preventDefault()
        updateBlock(id, {
          type: BlockType.Paragraph,
          elementStyling: updateTextStyle(block.elementStyling, { checked: false }),
        })
        return
      }
      const previous = blocksRef.current[index - 1]
      if (!previous) {
        if (block.content === '' && blocksRef.current.length > 1) {
          event.preventDefault()
          const next = neighbour(index, 1)
          setBlocks((prev) => prev.filter((b) => b.element_uuid !== id))
          if (next) focusBlock(next.element_uuid, 'start')
        }
        return
      }
      event.preventDefault()
      if (isFocusableType(previous.type)) {
        // Merge into the previous block
        const joinAt = previous.content.length
        setBlocks((prev) =>
          prev
            .filter((b) => b.element_uuid !== id)
            .map((b) =>
              b.element_uuid === previous.element_uuid
                ? { ...b, content: b.content + block.content }
                : b
            )
        )
        focusBlock(previous.element_uuid, joinAt)
      } else if (block.content === '') {
        removeBlock(id)
      }
      return
    }

    if (key === 'ArrowUp' && !event.shiftKey && caretOnFirstLine(el)) {
      const previous = neighbour(index, -1)
      if (previous) {
        event.preventDefault()
        focusBlock(previous.element_uuid, 'end')
      } else if (onExitTop) {
        event.preventDefault()
        onExitTop()
      }
      return
    }

    if (key === 'ArrowDown' && !event.shiftKey && caretOnLastLine(el)) {
      const next = neighbour(index, 1)
      if (next) {
        event.preventDefault()
        focusBlock(next.element_uuid, 'start')
      }
      return
    }

    if (key === 'Escape') el.blur()
  }

  /* ------------------------------ drag and drop ------------------------------ */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const from = prev.findIndex((b) => b.element_uuid === active.id)
      const to = prev.findIndex((b) => b.element_uuid === over.id)
      return from < 0 || to < 0 ? prev : arrayMove(prev, from, to)
    })
  }

  /* ------------------------------ context ------------------------------ */
  const clearAutoFocus = useCallback(() => setAutoFocusId(null), [])
  const registerInput = useCallback((id: string, el: HTMLTextAreaElement | null) => {
    if (el) inputs.current.set(id, el)
    else inputs.current.delete(id)
  }, [])

  const context: EditorContextValue = {
    readOnly,
    pages,
    subPageNames: {},
    openPage,
    isPublishedView: false,
    dateViewCount,
    isPublic,
    isUserBroke,
    autoFocusId,
    clearAutoFocus,
    registerInput,
    onTextChange,
    onTextKeyDown,
    onTextFocus: (block) => {
      if (slash && slash.blockId !== block.element_uuid) setSlash(null)
    },
    onTextBlur: (block) => {
      if (slash?.blockId === block.element_uuid) setSlash(null)
    },
    updateBlock,
  }

  const numbers = listNumbers(blocks)
  const menuBlock = menu ? blocks.find((b) => b.element_uuid === menu.blockId) ?? null : null

  if (readOnly) {
    return (
      <EditorContext.Provider value={context}>
        {blocks.map((block, i) => (
          <StaticBlockShell key={block.element_uuid} block={block}>
            <BlockRenderer block={block} listNumber={numbers[i]} />
          </StaticBlockShell>
        ))}
      </EditorContext.Provider>
    )
  }

  return (
    <EditorContext.Provider value={context}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={() => {
          setSlash(null)
          setMenu(null)
        }}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          items={blocks.map((b) => b.element_uuid)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, i) => (
            <BlockShell
              key={block.element_uuid}
              block={block}
              selected={menu?.blockId === block.element_uuid}
              onAdd={addBelow}
              onOpenMenu={(blockId, anchor) => {
                setSlash(null)
                setMenu({ blockId, anchor })
              }}
            >
              <BlockRenderer block={block} listNumber={numbers[i]} />
            </BlockShell>
          ))}
        </SortableContext>
      </DndContext>

      {/* Clicking the empty space below the last block continues the page */}
      <Box
        onClick={addTrailing}
        aria-hidden
        sx={{
          minHeight: blocks.length ? '28vh' : 64,
          cursor: 'text',
          pt: 1,
          color: 'text.secondary',
          opacity: 0.6,
          fontSize: 16,
        }}
      >
        {blocks.length === 0 && "Click here and type '/' to add a block"}
      </Box>

      <SlashMenu
        anchorEl={slash ? inputs.current.get(slash.blockId) ?? null : null}
        options={slashOptions}
        activeIndex={slash?.active ?? 0}
        onHover={(active) => slash && setSlash({ ...slash, active })}
        onSelect={chooseSlash}
      />

      <BlockMenu
        anchorEl={menuBlock ? menu?.anchor ?? null : null}
        block={menuBlock}
        onClose={() => setMenu(null)}
        onTurnInto={(type) => menuBlock && turnInto(menuBlock, type)}
        onStyle={(changes) => menuBlock && setStyle(menuBlock.element_uuid, changes)}
        onDuplicate={() => menuBlock && duplicate(menuBlock.element_uuid)}
        onMove={(delta) => {
          if (menuBlock) move(menuBlock.element_uuid, delta)
          setMenu(null)
        }}
        onDelete={() => menuBlock && deleteBlock(menuBlock.element_uuid)}
      />
    </EditorContext.Provider>
  )
})

export default Editor
