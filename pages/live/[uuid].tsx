import Head from 'next/head'
import Image from 'next/image'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'

import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import BlockRenderer, { listNumbers } from '@/components/Editor/BlockRenderer'
import { StaticBlockShell } from '@/components/Editor/BlockShell'
import { EditorContext,readOnlyEditorContext } from '@/components/Editor/context'
import { useColorMode } from '@/contexts/ColorMode'
import { usePageGet } from '@/hooks/Page/usePageGet'
import { coverBackground } from '@/lib/blocks/covers'
import { BlockType, parsePageEtc } from '@/lib/blocks/types'
import logo from 'public/images/opal.png'

/**
 * A published, read-only page at /live/<uuid>, with a table of contents for longer pages.
 */
const LivePage = () => {
  const router = useRouter()
  const { uuid } = router.query
  const colorMode = useColorMode()
  const [isLoading, setIsLoading] = useState(true)

  const { pageTitle, dateViewCount, pageElements, isPublicPage, pageEtc, subPages, notFound } =
    usePageGet(uuid as string, setIsLoading)

  const etc = parsePageEtc(pageEtc)
  const cover = coverBackground(etc.cover)
  const numbers = listNumbers(pageElements)
  const headings = useMemo(
    () =>
      pageElements
        .map((block, index) => ({ block, index }))
        .filter(
          ({ block }) =>
            [BlockType.H1, BlockType.H2, BlockType.H3].includes(block.type as never) &&
            block.content.trim()
        ),
    [pageElements]
  )

  const context = readOnlyEditorContext({
    isPublishedView: true,
    subPageNames: subPages,
    dateViewCount,
    isPublic: true,
  })

  const title = pageTitle && pageTitle !== 'Untitled' ? pageTitle : 'Untitled'
  const unavailable = !isLoading && (notFound || !isPublicPage)

  return (
    <Box sx={{ minHeight: '100dvh', backgroundColor: 'background.default', color: 'text.primary' }}>
      <Head>
        <title>
          {unavailable
            ? 'Page not available · Opal Labs'
            : `${etc.icon ? `${etc.icon} ` : ''}${title} · Opal Labs`}
        </title>
        <meta property="og:title" content={title} />
      </Head>

      {/* Header */}
      <Box
        component="header"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: { xs: 2, sm: 3 },
          height: 52,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: (theme) =>
            theme.palette.mode === 'dark' ? 'rgba(25,25,25,0.85)' : 'rgba(255,255,255,0.85)',
          backdropFilter: 'saturate(180%) blur(10px)',
        }}
      >
        <Box
          component={NextLink}
          href="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          <Image src={logo} alt="" width={26} height={26} />
          <Box sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}>Opal Labs</Box>
        </Box>
        <Box sx={{ flex: 1 }} />
        <Tooltip title={colorMode.mode === 'dark' ? 'Light mode' : 'Dark mode'}>
          <IconButton
            aria-label="Toggle dark mode"
            onClick={colorMode.toggle}
            sx={{ color: 'text.secondary' }}
          >
            {colorMode.mode === 'dark' ? (
              <LightModeOutlinedIcon fontSize="small" />
            ) : (
              <DarkModeOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>
        <Button component={NextLink} href="/" variant="contained" size="small">
          Try Opal Labs
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', height: '70vh' }}>
          <CircularProgress size={28} />
        </Box>
      ) : unavailable ? (
        <Box
          sx={{ display: 'grid', placeItems: 'center', height: '70vh', textAlign: 'center', px: 3 }}
        >
          <Box>
            <Box sx={{ fontSize: 48, mb: 1 }}>🔒</Box>
            <Box sx={{ fontSize: 22, fontWeight: 700 }}>This page isn’t available</Box>
            <Box sx={{ color: 'text.secondary', mt: 0.5, mb: 3, maxWidth: 380 }}>
              It may be private, unpublished or deleted. Ask the owner to publish it from the Share
              menu.
            </Box>
            <Button component={NextLink} href="/" variant="contained">
              Go to Opal Labs
            </Button>
          </Box>
        </Box>
      ) : (
        <Box component="article">
          {cover && <Box sx={{ height: { xs: 150, sm: 240 }, background: cover }} />}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 6, px: { xs: 3, sm: 6 } }}>
            <Box
              sx={{
                width: '100%',
                maxWidth: etc.fullWidth ? 1100 : 760,
                pt: cover ? 0 : { xs: 5, sm: 9 },
                pb: 10,
              }}
            >
              {etc.icon && (
                <Box
                  sx={{
                    fontSize: { xs: 56, sm: 72 },
                    lineHeight: 1,
                    mt: cover ? { xs: -4.5, sm: -5.5 } : 0,
                    mb: 1.5,
                    position: 'relative',
                  }}
                >
                  {etc.icon}
                </Box>
              )}
              <Box
                component="h1"
                sx={{
                  m: 0,
                  mb: 2,
                  fontSize: { xs: 32, sm: 40 },
                  fontWeight: 750,
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                }}
              >
                {title}
              </Box>
              <EditorContext.Provider value={context}>
                {pageElements.map((block, index) => (
                  <Box
                    key={block.element_uuid || index}
                    id={`block-${index}`}
                    sx={{ scrollMarginTop: 72 }}
                  >
                    <StaticBlockShell block={block}>
                      <BlockRenderer block={block} listNumber={numbers[index]} />
                    </StaticBlockShell>
                  </Box>
                ))}
              </EditorContext.Provider>
              <Box
                sx={{
                  mt: 8,
                  pt: 3,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  fontSize: 13,
                  color: 'text.secondary',
                }}
              >
                <Image src={logo} alt="" width={18} height={18} />
                Published with
                <Box
                  component={NextLink}
                  href="/"
                  sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
                >
                  Opal Labs
                </Box>
              </Box>
            </Box>

            {/* Table of contents on wide screens */}
            {headings.length >= 3 && (
              <Box
                component="nav"
                aria-label="On this page"
                sx={{
                  display: { xs: 'none', lg: 'block' },
                  width: 220,
                  flexShrink: 0,
                  pt: cover ? 4 : 10,
                }}
              >
                <Box sx={{ position: 'sticky', top: 84 }}>
                  <Box
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      mb: 1,
                    }}
                  >
                    On this page
                  </Box>
                  {headings.map(({ block, index }) => (
                    <Box
                      key={index}
                      component="a"
                      href={`#block-${index}`}
                      sx={{
                        display: 'block',
                        py: 0.5,
                        pl: block.type === BlockType.H1 ? 0 : block.type === BlockType.H2 ? 1.5 : 3,
                        fontSize: 13,
                        color: 'text.secondary',
                        textDecoration: 'none',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        '&:hover': { color: 'text.primary' },
                      }}
                    >
                      {block.content}
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default LivePage
