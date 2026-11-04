import { FormEvent, useEffect, useRef, useState } from 'react'

import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import LanguageIcon from '@mui/icons-material/Language'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import Link from '@mui/material/Link'

import { Block, BlockType } from '@/lib/blocks/types'
import isURL from 'validator/lib/isURL'

import { useEditor } from '../context'

/** Turns share links into embeddable ones; also says whether it is a 16:9 video */
export const toEmbed = (rawUrl: string): { src: string; video: boolean } => {
  const url = rawUrl.trim()
  let match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  )
  if (match) return { src: `https://www.youtube.com/embed/${match[1]}`, video: true }
  match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (match) return { src: `https://player.vimeo.com/video/${match[1]}`, video: true }
  match = url.match(/loom\.com\/(?:share|embed)\/(\w+)/)
  if (match) return { src: `https://www.loom.com/embed/${match[1]}`, video: true }
  if (/figma\.com\/(file|design|proto|board)\//.test(url) && !url.includes('/embed'))
    return {
      src: `https://www.figma.com/embed?embed_host=opal-labs&url=${encodeURIComponent(url)}`,
      video: false,
    }
  return { src: url, video: false }
}

const withProtocol = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

/** Link input shown before an embed or image has a URL */
const UrlPrompt = ({ block, kind }: { block: Block; kind: 'embed' | 'image' }) => {
  const editor = useEditor()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (editor.autoFocusId === block.element_uuid) {
      inputRef.current?.focus()
      editor.clearAutoFocus()
    }
  }, [editor, block.element_uuid])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const url = withProtocol(value.trim())
    if (!isURL(url, { require_protocol: true })) {
      setError('That doesn’t look like a link')
      return
    }
    editor.updateBlock(block.element_uuid, { content: url })
  }

  const Icon = kind === 'image' ? ImageOutlinedIcon : LanguageIcon

  if (editor.readOnly) return null

  return (
    <Box
      component="form"
      onSubmit={submit}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        p: 1.5,
        pl: 2,
        borderRadius: 2,
        border: '1px dashed',
        borderColor: error ? 'error.main' : 'divider',
        backgroundColor: 'action.hover',
      }}
    >
      <Icon sx={{ color: 'text.secondary' }} />
      <InputBase
        inputRef={inputRef}
        value={value}
        onChange={(event) => {
          setValue(event.target.value)
          setError('')
        }}
        placeholder={
          kind === 'image'
            ? 'Paste an image link…'
            : 'Paste a link: YouTube, Figma, Google Maps, any site that allows embedding…'
        }
        fullWidth
        inputProps={{ 'aria-label': kind === 'image' ? 'Image link' : 'Embed link' }}
        sx={{ fontSize: 14 }}
      />
      {error && <Box sx={{ color: 'error.main', fontSize: 12, whiteSpace: 'nowrap' }}>{error}</Box>}
      <Button type="submit" variant="contained" size="small" disabled={!value.trim()}>
        {kind === 'image' ? 'Add image' : 'Embed'}
      </Button>
    </Box>
  )
}

/** Small bar under media showing where it comes from */
const SourceBar = ({ block, url }: { block: Block; url: string }) => {
  const editor = useEditor()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        mt: 0.75,
        fontSize: 12,
        color: 'text.secondary',
      }}
    >
      <Link
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        color="inherit"
        underline="hover"
        sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
      >
        {hostOf(url)}
        <OpenInNewIcon sx={{ fontSize: 12 }} />
      </Link>
      {!editor.readOnly && (
        <Link
          component="button"
          color="inherit"
          underline="hover"
          onClick={() => editor.updateBlock(block.element_uuid, { content: '' })}
          sx={{ fontSize: 12 }}
        >
          Change link
        </Link>
      )}
    </Box>
  )
}

export const EmbedBlock = ({ block }: { block: Block }) => {
  if (!block.content) return <UrlPrompt block={block} kind="embed" />
  const { src, video } = toEmbed(block.content)

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'action.hover',
          ...(video ? { aspectRatio: '16 / 9' } : { height: 440 }),
        }}
      >
        <iframe
          src={src}
          title={`Embedded content from ${hostOf(src)}`}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ border: 0, width: '100%', height: '100%', display: 'block' }}
        />
      </Box>
      <SourceBar block={block} url={block.content} />
    </Box>
  )
}

export const ImageBlock = ({ block }: { block: Block }) => {
  const editor = useEditor()
  const [failed, setFailed] = useState(false)

  useEffect(() => setFailed(false), [block.content])

  if (!block.content) return <UrlPrompt block={block} kind="image" />

  return (
    <Box component="figure" sx={{ m: 0 }}>
      {failed ? (
        <Box
          sx={{
            p: 3,
            borderRadius: 2,
            backgroundColor: 'action.hover',
            color: 'text.secondary',
            textAlign: 'center',
            fontSize: 14,
          }}
        >
          This image couldn’t be loaded.
        </Box>
      ) : (
        // A plain img: images come from any site, which next/image can't optimise without a whitelist
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={block.content}
          alt={block.elementStyling || 'Image'}
          loading="lazy"
          onError={() => setFailed(true)}
          style={{ display: 'block', maxWidth: '100%', borderRadius: 10, margin: '0 auto' }}
        />
      )}
      {editor.readOnly ? (
        block.elementStyling && (
          <Box
            component="figcaption"
            sx={{ mt: 0.75, fontSize: 14, color: 'text.secondary', textAlign: 'center' }}
          >
            {block.elementStyling}
          </Box>
        )
      ) : (
        <InputBase
          value={block.elementStyling}
          onChange={(event) =>
            editor.updateBlock(block.element_uuid, { elementStyling: event.target.value })
          }
          placeholder="Add a caption…"
          fullWidth
          inputProps={{ 'aria-label': 'Image caption', style: { textAlign: 'center' } }}
          sx={{ mt: 0.5, fontSize: 14, color: 'text.secondary' }}
        />
      )}
      {!editor.readOnly && <SourceBar block={block} url={block.content} />}
    </Box>
  )
}

export const DividerBlock = () => (
  <Box sx={{ py: 1.25 }} aria-hidden>
    <Box sx={{ height: '1px', backgroundColor: 'divider' }} />
  </Box>
)

export const isMediaType = (type: string) => type === BlockType.Embed || type === BlockType.Image
