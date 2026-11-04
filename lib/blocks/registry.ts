import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined'
import CodeIcon from '@mui/icons-material/Code'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import FormatQuoteIcon from '@mui/icons-material/FormatQuote'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined'
import Looks3OutlinedIcon from '@mui/icons-material/Looks3Outlined'
import LooksOneOutlinedIcon from '@mui/icons-material/LooksOneOutlined'
import LooksTwoOutlinedIcon from '@mui/icons-material/LooksTwoOutlined'
import NotesIcon from '@mui/icons-material/Notes'

import { BlockType } from './types'

export type BlockOption = {
  type: string
  label: string
  description: string
  icon: typeof NotesIcon
  keywords: string[]
  group: 'Basic blocks' | 'Media' | 'Advanced'
  /** Markdown-style shortcut shown in the menu */
  shortcut?: string
}

/** Everything the slash menu and "Turn into" list can create */
export const BLOCK_OPTIONS: BlockOption[] = [
  {
    type: BlockType.Paragraph,
    label: 'Text',
    description: 'Just start writing with plain text.',
    icon: NotesIcon,
    keywords: ['paragraph', 'plain', 'p'],
    group: 'Basic blocks',
  },
  {
    type: BlockType.H1,
    label: 'Heading 1',
    description: 'Big section heading.',
    icon: LooksOneOutlinedIcon,
    keywords: ['h1', 'title', 'heading'],
    group: 'Basic blocks',
    shortcut: '#',
  },
  {
    type: BlockType.H2,
    label: 'Heading 2',
    description: 'Medium section heading.',
    icon: LooksTwoOutlinedIcon,
    keywords: ['h2', 'subtitle', 'heading'],
    group: 'Basic blocks',
    shortcut: '##',
  },
  {
    type: BlockType.H3,
    label: 'Heading 3',
    description: 'Small section heading.',
    icon: Looks3OutlinedIcon,
    keywords: ['h3', 'heading'],
    group: 'Basic blocks',
    shortcut: '###',
  },
  {
    type: BlockType.Bulleted,
    label: 'Bulleted list',
    description: 'Create a simple bulleted list.',
    icon: FormatListBulletedIcon,
    keywords: ['ul', 'unordered', 'bullet', 'list'],
    group: 'Basic blocks',
    shortcut: '-',
  },
  {
    type: BlockType.Numbered,
    label: 'Numbered list',
    description: 'Create a list with numbering.',
    icon: FormatListNumberedIcon,
    keywords: ['ol', 'ordered', 'number', 'list'],
    group: 'Basic blocks',
    shortcut: '1.',
  },
  {
    type: BlockType.Todo,
    label: 'To-do list',
    description: 'Track tasks with a checkbox.',
    icon: CheckBoxOutlinedIcon,
    keywords: ['todo', 'task', 'checkbox', 'check'],
    group: 'Basic blocks',
    shortcut: '[]',
  },
  {
    type: BlockType.Quote,
    label: 'Quote',
    description: 'Capture a quote.',
    icon: FormatQuoteIcon,
    keywords: ['blockquote', 'citation'],
    group: 'Basic blocks',
    shortcut: '>',
  },
  {
    type: BlockType.Callout,
    label: 'Callout',
    description: 'Make writing stand out.',
    icon: LightbulbOutlinedIcon,
    keywords: ['note', 'tip', 'warning', 'info', 'highlight'],
    group: 'Basic blocks',
  },
  {
    type: BlockType.Divider,
    label: 'Divider',
    description: 'Visually divide blocks.',
    icon: HorizontalRuleIcon,
    keywords: ['hr', 'line', 'separator'],
    group: 'Basic blocks',
    shortcut: '---',
  },
  {
    type: BlockType.SubPage,
    label: 'Page',
    description: 'Embed a sub-page inside this page.',
    icon: DescriptionOutlinedIcon,
    keywords: ['subpage', 'nested', 'child', 'link'],
    group: 'Basic blocks',
  },
  {
    type: BlockType.Image,
    label: 'Image',
    description: 'Show an image from a link.',
    icon: ImageOutlinedIcon,
    keywords: ['picture', 'photo', 'img', 'gif'],
    group: 'Media',
  },
  {
    type: BlockType.Embed,
    label: 'Web embed',
    description: 'YouTube, Figma, maps, any website.',
    icon: LanguageIcon,
    keywords: ['iframe', 'video', 'youtube', 'website', 'embed', 'link'],
    group: 'Media',
  },
  {
    type: BlockType.Code,
    label: 'Code',
    description: 'Write code with syntax highlighting.',
    icon: CodeIcon,
    keywords: ['snippet', 'programming', 'pre'],
    group: 'Advanced',
    shortcut: '```',
  },
  {
    type: BlockType.Analytics,
    label: 'Page analytics',
    description: 'Chart of views once published.',
    icon: InsertChartOutlinedIcon,
    keywords: ['chart', 'views', 'stats', 'graph'],
    group: 'Advanced',
  },
]

export const optionFor = (type: string) =>
  BLOCK_OPTIONS.find((option) => option.type === type) ?? BLOCK_OPTIONS[0]

/** Filters options for the slash menu; labels starting with the query rank first */
export const filterOptions = (query: string) => {
  const q = query.trim().toLowerCase()
  if (!q) return BLOCK_OPTIONS
  const scored = BLOCK_OPTIONS.map((option) => {
    const label = option.label.toLowerCase()
    let score = 0
    if (label.startsWith(q)) score = 3
    else if (label.includes(q)) score = 2
    else if (option.keywords.some((keyword) => keyword.startsWith(q))) score = 1
    return { option, score }
  })
  return scored
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ option }) => option)
}

/** Types a text block can be turned into */
export const TURN_INTO_TYPES = [
  BlockType.Paragraph,
  BlockType.H1,
  BlockType.H2,
  BlockType.H3,
  BlockType.Bulleted,
  BlockType.Numbered,
  BlockType.Todo,
  BlockType.Quote,
  BlockType.Callout,
]
