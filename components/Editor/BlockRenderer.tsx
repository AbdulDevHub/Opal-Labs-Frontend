import { Block, BlockType } from '@/lib/blocks/types'

import AnalyticsBlock from './blocks/AnalyticsBlock'
import CodeBlock from './blocks/CodeBlock'
import { DividerBlock, EmbedBlock, ImageBlock } from './blocks/MediaBlock'
import SubPageBlock from './blocks/SubPageBlock'
import TextBlock, { DEFAULT_METRICS, TEXT_METRICS } from './blocks/TextBlock'

/** Draws one block; shared by the editor and published pages */
const BlockRenderer = ({ block, listNumber }: { block: Block; listNumber?: number }) => {
  switch (block.type) {
    case BlockType.Code:
      return <CodeBlock block={block} />
    case BlockType.Embed:
      return <EmbedBlock block={block} />
    case BlockType.Image:
      return <ImageBlock block={block} />
    case BlockType.Divider:
      return <DividerBlock />
    case BlockType.SubPage:
      return <SubPageBlock block={block} />
    case BlockType.Analytics:
      return <AnalyticsBlock />
    default:
      return <TextBlock block={block} listNumber={listNumber} />
  }
}

export default BlockRenderer

/** Space above each block type (headings get more room) */
export const blockSpacing = (type: string) => {
  switch (type) {
    case BlockType.H1:
      return 22
    case BlockType.H2:
      return 16
    case BlockType.H3:
      return 10
    case BlockType.Callout:
    case BlockType.Code:
    case BlockType.Embed:
    case BlockType.Image:
    case BlockType.Analytics:
      return 8
    default:
      return 2
  }
}

/** Vertical offset that lines the gutter buttons up with the block's first line */
export const gutterOffset = (type: string) => {
  const metrics = TEXT_METRICS[type] ?? DEFAULT_METRICS
  if (type === BlockType.Callout) return blockSpacing(type) + 14
  if (type === BlockType.Code) return blockSpacing(type) + 4
  if (type === BlockType.Divider) return blockSpacing(type) + 0
  if ([BlockType.Embed, BlockType.Image, BlockType.Analytics].includes(type as never))
    return blockSpacing(type) + 4
  return blockSpacing(type) + Math.max(0, (metrics.fontSize * metrics.lineHeight - 26) / 2)
}

/** Numbers for consecutive numbered-list blocks */
export const listNumbers = (blocks: Block[]) => {
  let count = 0
  return blocks.map((block) => {
    count = block.type === BlockType.Numbered ? count + 1 : 0
    return count
  })
}
