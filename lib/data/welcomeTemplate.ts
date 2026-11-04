import type { StoredElement } from './types'

/**
 * Welcome page seeded for guests.
 * Copied from Opal-Labs-Backend/controllers/templates/welcome so both modes start the same way.
 */
export const WELCOME_PAGE_NAME = 'Welcome!'

const heading = 'normal;  color: #000000; bold'

export const WELCOME_ELEMENTS: Omit<StoredElement, 'element_uuid'>[] = [
  {
    type: 'Callout',
    content: { text: 'Welcome to Opal Labs, the ultimate note taking experience!' },
    etc: { text: '💡' },
  },
  {
    type: 'Heading 3',
    content: { text: 'To Get Started, Try Writing Your Name In The Code Block' },
    etc: { text: heading },
  },
  {
    type: 'Code Block',
    content: { text: 'const YourNameHere = "What an awesome site!"' },
    etc: { text: 'theme: tomorrow_night_blue; language: javascript' },
  },
  {
    type: 'Heading 3',
    content: { text: 'Now Try Adding Your Favourite YouTube Video Or Website' },
    etc: { text: heading },
  },
  {
    type: 'iFrame',
    content: { text: 'https://www.youtube.com/embed/7DfXKkvjW-E' },
    etc: { text: '' },
  },
  {
    type: 'Heading 3',
    content: { text: "Why Don't You Try Creating Any New Element Right Below This" },
    etc: { text: heading },
  },
  {
    type: 'Heading 3',
    content: { text: 'Please Write Down Below 3 Reasons You Want To Use This Site' },
    etc: { text: heading },
  },
  { type: 'Checkbox', content: { text: '' }, etc: { text: '' } },
  { type: 'Checkbox', content: { text: '' }, etc: { text: '' } },
  { type: 'Checkbox', content: { text: '' }, etc: { text: '' } },
  {
    type: 'Heading 3',
    content: { text: 'Now Try Favouriting This Page To Have Easy Access' },
    etc: { text: heading },
  },
  {
    type: 'Heading 3',
    content: {
      text: "These are just the basics! There's a lot more you can do with this site. Have Fun Exploring And Remember To Always Save!",
    },
    etc: { text: 'color: #FFC107; normal; italic bold' },
  },
]
