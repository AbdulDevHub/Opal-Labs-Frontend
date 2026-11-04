import { parseSettings, parseTextStyle } from './styling'
import { Block, BlockType } from './types'

/**
 * Converts a page to Markdown for the "Export" action.
 *
 * @param title - The page title
 * @param blocks - The page's blocks in order
 * @param subPageName - Looks up a sub-page's current name
 */
export const toMarkdown = (
  title: string,
  blocks: Block[],
  subPageName: (uuid: string) => string,
  icon?: string
) => {
  const lines: string[] = [`# ${icon ? `${icon} ` : ''}${title || 'Untitled'}`, '']
  let number = 0

  blocks.forEach((block) => {
    const text = block.content ?? ''
    number = block.type === BlockType.Numbered ? number + 1 : 0

    switch (block.type) {
      case BlockType.H1:
        lines.push(`## ${text}`, '')
        break
      case BlockType.H2:
        lines.push(`### ${text}`, '')
        break
      case BlockType.H3:
        lines.push(`#### ${text}`, '')
        break
      case BlockType.Bulleted:
        lines.push(`- ${text}`)
        break
      case BlockType.Numbered:
        lines.push(`${number}. ${text}`)
        break
      case BlockType.Todo:
        lines.push(`- [${parseTextStyle(block.elementStyling).checked ? 'x' : ' '}] ${text}`)
        break
      case BlockType.Quote:
        lines.push(...text.split('\n').map((line) => `> ${line}`), '')
        break
      case BlockType.Callout:
        lines.push(`> ${block.elementStyling || '💡'} ${text.split('\n').join('\n> ')}`, '')
        break
      case BlockType.Code:
        lines.push('```' + (parseSettings(block.elementStyling).language ?? ''), text, '```', '')
        break
      case BlockType.Divider:
        lines.push('---', '')
        break
      case BlockType.Image:
        lines.push(`![${block.elementStyling || 'Image'}](${text})`, '')
        break
      case BlockType.Embed:
        lines.push(`[${text}](${text})`, '')
        break
      case BlockType.SubPage:
        lines.push(`📄 **${subPageName(block.elementStyling)}**`, '')
        break
      case BlockType.Analytics:
        break
      default:
        lines.push(text, '')
    }
  })

  return (
    lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim() + '\n'
  )
}

/** Starts a file download in the browser */
export const downloadFile = (fileName: string, contents: string, type = 'text/markdown') => {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Word count over every text-bearing block */
export const countWords = (title: string, blocks: Block[]) => {
  const text = [
    title,
    ...blocks
      .filter((block) => block.type !== BlockType.Code && block.type !== BlockType.Embed)
      .filter((block) => block.type !== BlockType.Image && block.type !== BlockType.SubPage)
      .map((block) => block.content),
  ].join(' ')
  return text.split(/\s+/).filter(Boolean).length
}
