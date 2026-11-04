/**
 * Text block styling is stored as a loose string, e.g. "normal; color: #FFC107; italic bold".
 * The format predates this file, so the parser accepts everything older versions wrote.
 */

export type TextStyle = {
  bold: boolean
  italic: boolean
  underline: boolean
  strikethrough: boolean
  checked: boolean
  color?: string
  highlight?: string
}

// Colours older versions used as "no colour"
const DEFAULT_COLORS = ['#000000', '#000', '#212121', 'black', '#ffffff', 'white']

export const parseTextStyle = (styling: string): TextStyle => {
  const style: TextStyle = {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    checked: false,
  }

  for (const rawPart of (styling || '').split(';')) {
    const part = rawPart.trim()
    if (!part) continue

    const match = part.match(/^(background-color|color)\s*:\s*(.+)$/i)
    if (match) {
      const value = match[2].trim()
      if (match[1].toLowerCase() === 'color') {
        if (!DEFAULT_COLORS.includes(value.toLowerCase())) style.color = value
      } else if (value !== 'transparent') {
        style.highlight = value
      }
      continue
    }

    for (const word of part.split(/\s+/)) {
      if (word === 'bold') style.bold = true
      else if (word === 'italic') style.italic = true
      else if (word === 'underline') style.underline = true
      else if (word === 'strikethrough') style.strikethrough = true
      else if (word === 'checked') style.checked = true
    }
  }
  return style
}

export const serializeTextStyle = (style: TextStyle): string => {
  const flags = (['bold', 'italic', 'underline', 'strikethrough', 'checked'] as const).filter(
    (flag) => style[flag]
  )
  const parts = [flags.length ? flags.join(' ') : 'normal']
  if (style.color) parts.push(`color: ${style.color}`)
  if (style.highlight) parts.push(`background-color: ${style.highlight}`)
  return parts.join('; ')
}

export const updateTextStyle = (styling: string, changes: Partial<TextStyle>) =>
  serializeTextStyle({ ...parseTextStyle(styling), ...changes })

/** "key: value; key: value" settings used by code blocks */
export const parseSettings = (styling: string): Record<string, string> =>
  (styling || '').split(';').reduce<Record<string, string>>((settings, part) => {
    const [key, ...rest] = part.split(':')
    if (key && key.trim()) settings[key.trim()] = rest.join(':').trim()
    return settings
  }, {})

export const serializeSettings = (settings: Record<string, string>) =>
  Object.entries(settings)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => `${key}: ${value}`)
    .join('; ')

/** Colours that read well on both light and dark backgrounds */
export const TEXT_COLORS: { name: string; value?: string }[] = [
  { name: 'Default' },
  { name: 'Gray', value: '#8A8F98' },
  { name: 'Brown', value: '#A27763' },
  { name: 'Orange', value: '#E07C39' },
  { name: 'Yellow', value: '#D9A520' },
  { name: 'Green', value: '#3FA672' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Purple', value: '#9B6EE8' },
  { name: 'Pink', value: '#E255A1' },
  { name: 'Red', value: '#E5484D' },
]

export const HIGHLIGHT_COLORS: { name: string; value?: string }[] = [
  { name: 'Default' },
  { name: 'Gray', value: 'rgba(138, 143, 152, 0.2)' },
  { name: 'Brown', value: 'rgba(162, 119, 99, 0.22)' },
  { name: 'Orange', value: 'rgba(224, 124, 57, 0.22)' },
  { name: 'Yellow', value: 'rgba(234, 179, 8, 0.25)' },
  { name: 'Green', value: 'rgba(63, 166, 114, 0.22)' },
  { name: 'Blue', value: 'rgba(59, 130, 246, 0.2)' },
  { name: 'Purple', value: 'rgba(155, 110, 232, 0.22)' },
  { name: 'Pink', value: 'rgba(226, 85, 161, 0.2)' },
  { name: 'Red', value: 'rgba(229, 72, 77, 0.2)' },
]
