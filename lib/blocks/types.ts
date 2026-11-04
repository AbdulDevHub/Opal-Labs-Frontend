import { v4 as uuidv4 } from 'uuid'

/**
 * A block (the backend calls it an "element"). `elementStyling` is the backend's `etc.text`.
 * The type names are stored in the database (varchar(20)), so never rename existing ones.
 */
export type Block = {
  element_uuid: string
  type: string
  content: string
  elementStyling: string
}

export const BlockType = {
  H1: 'Heading 1',
  H2: 'Heading 2',
  H3: 'Heading 3',
  Paragraph: 'Paragraph',
  Bulleted: 'Bulleted List',
  Numbered: 'Numbered List',
  Todo: 'Checkbox',
  Quote: 'Quote',
  Callout: 'Callout',
  Code: 'Code Block',
  Embed: 'iFrame',
  Image: 'Image',
  Divider: 'Divider',
  SubPage: 'Nested Page',
  Analytics: 'Page Analytics',
} as const

/** Blocks edited as plain text whose styling string holds bold / colour etc. */
export const TEXT_TYPES: string[] = [
  BlockType.Paragraph,
  BlockType.H1,
  BlockType.H2,
  BlockType.H3,
  BlockType.Bulleted,
  BlockType.Numbered,
  BlockType.Todo,
  BlockType.Quote,
]

/** Lists continue onto the next line when Enter is pressed */
export const LIST_TYPES: string[] = [BlockType.Bulleted, BlockType.Numbered, BlockType.Todo]

export const isTextType = (type: string) => TEXT_TYPES.includes(type) || !KNOWN_TYPES.has(type)

/** Blocks with a text box the keyboard can move between */
export const isFocusableType = (type: string) => isTextType(type) || type === BlockType.Callout

const KNOWN_TYPES = new Set<string>(Object.values(BlockType))

const DEFAULT_STYLING: Record<string, string> = {
  [BlockType.Callout]: '💡',
  [BlockType.Code]: 'theme: one_dark; language: javascript',
}

export const newBlock = (type: string, content = '', elementStyling?: string): Block => ({
  element_uuid: uuidv4(),
  type,
  content,
  elementStyling: elementStyling ?? DEFAULT_STYLING[type] ?? (isTextType(type) ? 'normal' : ''),
})

/** Copies blocks with fresh ids (templates, duplicating pages) */
export const cloneBlocks = (blocks: Omit<Block, 'element_uuid'>[]): Block[] =>
  blocks.map((block) => ({ ...block, element_uuid: uuidv4() }))

/** Extra page settings saved in the backend's page `etc` column */
export type PageEtc = {
  icon?: string
  cover?: string
  fullWidth?: boolean
  locked?: boolean
}

export const parsePageEtc = (etc: unknown): PageEtc => {
  if (!etc || typeof etc !== 'object') return {}
  const value = etc as Record<string, unknown>
  return {
    icon: typeof value.icon === 'string' ? value.icon : undefined,
    cover: typeof value.cover === 'string' ? value.cover : undefined,
    fullWidth: value.fullWidth === true ? true : undefined,
    locked: value.locked === true ? true : undefined,
  }
}
