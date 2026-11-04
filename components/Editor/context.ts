import { createContext, KeyboardEvent, useContext } from 'react'

import type { PageType } from '@/hooks/Page/usePageList'
import type { Block } from '@/lib/blocks/types'

/** What every block can read and do. Read-only views (published pages) leave the handlers as no-ops */
export type EditorContextValue = {
  readOnly: boolean
  /** All the user's pages, for sub-page names and icons (empty on published pages) */
  pages: PageType[]
  /** Sub-page names sent with a published page */
  subPageNames: Record<string, string>
  /** Opens a sub-page (dashboard) or links to its published version */
  openPage: (pageUuid: string) => void
  /** Published pages link sub-pages to /live/<uuid> */
  isPublishedView: boolean
  dateViewCount: Record<string, number>
  isPublic: boolean
  isUserBroke: boolean
  /** Block id whose own input should take focus once (new embeds, images, code) */
  autoFocusId: string | null
  clearAutoFocus: () => void
  registerInput: (blockId: string, element: HTMLTextAreaElement | null) => void
  onTextChange: (block: Block, value: string) => void
  onTextKeyDown: (event: KeyboardEvent<HTMLElement>, block: Block) => void
  onTextFocus: (block: Block) => void
  onTextBlur: (block: Block) => void
  updateBlock: (blockId: string, changes: Partial<Block>) => void
}

const noop = () => {}

export const readOnlyEditorContext = (
  overrides: Partial<EditorContextValue> = {}
): EditorContextValue => ({
  readOnly: true,
  pages: [],
  subPageNames: {},
  openPage: noop,
  isPublishedView: false,
  dateViewCount: {},
  isPublic: true,
  isUserBroke: false,
  autoFocusId: null,
  clearAutoFocus: noop,
  registerInput: noop,
  onTextChange: noop,
  onTextKeyDown: noop,
  onTextFocus: noop,
  onTextBlur: noop,
  updateBlock: noop,
  ...overrides,
})

export const EditorContext = createContext<EditorContextValue>(readOnlyEditorContext())

export const useEditor = () => useContext(EditorContext)
