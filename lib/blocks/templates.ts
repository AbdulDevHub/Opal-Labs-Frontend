import { Block, BlockType } from './types'

type TemplateBlock = Omit<Block, 'element_uuid'>

const text = (type: string, content: string, elementStyling = 'normal'): TemplateBlock => ({
  type,
  content,
  elementStyling,
})

export type PageTemplate = {
  id: string
  name: string
  description: string
  icon: string
  cover?: string
  title: string
  blocks: TemplateBlock[]
}

const today = () =>
  new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })

/** Starting points offered on an empty page */
export const PAGE_TEMPLATES: () => PageTemplate[] = () => [
  {
    id: 'todo',
    name: 'To-do list',
    description: 'Plan the day and tick things off',
    icon: '✅',
    cover: 'mint',
    title: 'To-do',
    blocks: [
      text(BlockType.Callout, 'Drag tasks with the ⋮⋮ handle to reprioritise.', '🎯'),
      text(BlockType.H2, 'Today'),
      text(BlockType.Todo, 'Reply to emails'),
      text(BlockType.Todo, 'Review the project plan'),
      text(BlockType.Todo, 'Go for a walk'),
      text(BlockType.H2, 'Later this week'),
      text(BlockType.Todo, ''),
    ],
  },
  {
    id: 'meeting',
    name: 'Meeting notes',
    description: 'Agenda, notes and action items',
    icon: '🗓️',
    cover: 'ocean',
    title: 'Meeting notes',
    blocks: [
      text(BlockType.Callout, `${today()} · Attendees: `, '👥'),
      text(BlockType.H2, 'Agenda'),
      text(BlockType.Numbered, ''),
      text(BlockType.H2, 'Notes'),
      text(BlockType.Bulleted, ''),
      text(BlockType.H2, 'Action items'),
      text(BlockType.Todo, ''),
    ],
  },
  {
    id: 'journal',
    name: 'Journal',
    description: 'A calm space for daily reflection',
    icon: '📔',
    cover: 'sunset',
    title: today(),
    blocks: [
      text(BlockType.Quote, 'What would make today great?', 'italic'),
      text(BlockType.Paragraph, ''),
      text(BlockType.H3, 'Three things I am grateful for'),
      text(BlockType.Numbered, ''),
      text(BlockType.Numbered, ''),
      text(BlockType.Numbered, ''),
      text(BlockType.H3, 'Thoughts'),
      text(BlockType.Paragraph, ''),
    ],
  },
  {
    id: 'project',
    name: 'Project brief',
    description: 'Goals, scope and milestones',
    icon: '🚀',
    cover: 'aurora',
    title: 'Project brief',
    blocks: [
      text(BlockType.Callout, 'One sentence that explains why this project matters.', '💡'),
      text(BlockType.H2, 'Goals'),
      text(BlockType.Bulleted, ''),
      text(BlockType.H2, 'Out of scope'),
      text(BlockType.Bulleted, ''),
      text(BlockType.H2, 'Milestones'),
      text(BlockType.Todo, 'Kick-off'),
      text(BlockType.Todo, 'First prototype'),
      text(BlockType.Todo, 'Launch'),
      { type: BlockType.Divider, content: '', elementStyling: '' },
      text(BlockType.H2, 'Open questions'),
      text(BlockType.Paragraph, ''),
    ],
  },
  {
    id: 'reading',
    name: 'Reading list',
    description: 'Books, articles and videos to get to',
    icon: '📚',
    cover: 'lavender',
    title: 'Reading list',
    blocks: [
      text(BlockType.H2, 'Up next'),
      text(BlockType.Todo, ''),
      text(BlockType.H2, 'Finished'),
      text(BlockType.Todo, '', 'checked'),
      text(BlockType.H2, 'Favourite quotes'),
      text(BlockType.Quote, ''),
    ],
  },
]
