import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import CheckIcon from '@mui/icons-material/Check'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

import { parseSettings, serializeSettings } from '@/lib/blocks/styling'
import type { Block } from '@/lib/blocks/types'
import { monoFontFamily } from '@/styles/theme'

import { useEditor } from '../context'

const CodeEditor = dynamic(() => import('./CodeEditor'), {
  ssr: false,
  loading: () => (
    <Box
      component="pre"
      sx={{ m: 0, p: 2, fontFamily: monoFontFamily, fontSize: 14, minHeight: 80, opacity: 0.6 }}
    />
  ),
})

export const LANGUAGES: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  java: 'Java',
  golang: 'Go',
  c_cpp: 'C / C++',
  rust: 'Rust',
  sql: 'SQL',
  json: 'JSON',
  html: 'HTML',
  css: 'CSS',
  markdown: 'Markdown',
  sh: 'Shell',
}

/** Ace themes and the background each one paints */
export const CODE_THEMES: Record<string, { name: string; background: string; dark: boolean }> = {
  one_dark: { name: 'One Dark', background: '#282C34', dark: true },
  github_dark: { name: 'GitHub Dark', background: '#24292E', dark: true },
  dracula: { name: 'Dracula', background: '#282A36', dark: true },
  monokai: { name: 'Monokai', background: '#272822', dark: true },
  tomorrow_night_blue: { name: 'Night Blue', background: '#002451', dark: true },
  chaos: { name: 'Chaos', background: '#161616', dark: true },
  github: { name: 'GitHub Light', background: '#FFFFFF', dark: false },
  tomorrow: { name: 'Tomorrow', background: '#FFFFFF', dark: false },
}

const selectSx = (dark: boolean) => ({
  fontSize: 12,
  fontWeight: 500,
  color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.65)',
  '& .MuiSelect-select': { py: 0.25, pl: 1 },
  '& .MuiSvgIcon-root': { color: 'inherit', fontSize: 18 },
  borderRadius: 1,
  '&:hover': { backgroundColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
})

/** Code block with language and theme pickers and a copy button */
const CodeBlock = ({ block }: { block: Block }) => {
  const editor = useEditor()
  const [copied, setCopied] = useState(false)

  const settings = parseSettings(block.elementStyling)
  const language = LANGUAGES[settings.language] ? settings.language : 'javascript'
  const themeKey = CODE_THEMES[settings.theme] ? settings.theme : 'one_dark'
  const theme = CODE_THEMES[themeKey]
  const showLineNumbers = settings.showLineNumbers !== 'false'
  const wrapLines = settings.wrapLines === 'true'

  const update = (changes: Record<string, string>) =>
    editor.updateBlock(block.element_uuid, {
      elementStyling: serializeSettings({ ...settings, ...changes }),
    })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(block.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard blocked
    }
  }

  const autoFocus = editor.autoFocusId === block.element_uuid
  const { clearAutoFocus } = editor
  useEffect(() => {
    if (autoFocus) clearAutoFocus()
  }, [autoFocus, clearAutoFocus])

  return (
    <Box
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
        backgroundColor: theme.background,
        border: '1px solid',
        borderColor: theme.dark ? 'rgba(255,255,255,0.08)' : 'divider',
        '& .ace_editor': { backgroundColor: `${theme.background} !important` },
        '& .ace_gutter': { backgroundColor: `${theme.background} !important` },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          px: 1,
          py: 0.5,
          borderBottom: '1px solid',
          borderColor: theme.dark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)',
        }}
      >
        {editor.readOnly ? (
          <Box
            sx={{
              fontSize: 12,
              fontWeight: 500,
              px: 1,
              color: theme.dark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.55)',
            }}
          >
            {LANGUAGES[language]}
          </Box>
        ) : (
          <>
            <Select
              variant="standard"
              disableUnderline
              value={language}
              onChange={(event) => update({ language: event.target.value })}
              sx={selectSx(theme.dark)}
              inputProps={{ 'aria-label': 'Code language' }}
            >
              {Object.entries(LANGUAGES).map(([key, name]) => (
                <MenuItem key={key} value={key} dense>
                  {name}
                </MenuItem>
              ))}
            </Select>
            <Select
              variant="standard"
              disableUnderline
              value={themeKey}
              onChange={(event) => update({ theme: event.target.value })}
              sx={selectSx(theme.dark)}
              inputProps={{ 'aria-label': 'Code theme' }}
            >
              {Object.entries(CODE_THEMES).map(([key, value]) => (
                <MenuItem key={key} value={key} dense>
                  {value.name}
                </MenuItem>
              ))}
            </Select>
            <Button
              size="small"
              onClick={() => update({ wrapLines: wrapLines ? 'false' : 'true' })}
              sx={{ ...selectSx(theme.dark), minWidth: 0, px: 1, whiteSpace: 'nowrap', display: { xs: 'none', sm: 'inline-flex' } }}
            >
              {wrapLines ? 'Wrap: on' : 'Wrap: off'}
            </Button>
          </>
        )}
        <Box sx={{ flex: 1 }} />
        <Button
          size="small"
          onClick={copy}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{
            ...selectSx(theme.dark),
            minWidth: 0,
            px: 1,
            '& .MuiButton-startIcon svg': { fontSize: 14 },
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </Box>
      <CodeEditor
        name={`code-${block.element_uuid}`}
        value={block.content}
        onChange={(value) => editor.updateBlock(block.element_uuid, { content: value })}
        language={language}
        theme={themeKey}
        showLineNumbers={showLineNumbers}
        wrapLines={wrapLines}
        readOnly={editor.readOnly}
        autoFocus={autoFocus}
      />
    </Box>
  )
}

export default CodeBlock
