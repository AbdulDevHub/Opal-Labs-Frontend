import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { ReactNode, useEffect } from 'react'

import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import GoogleIcon from '@mui/icons-material/Google'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined'
import SelfImprovementOutlinedIcon from '@mui/icons-material/SelfImprovementOutlined'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'

import { BLOCK_OPTIONS } from '@/lib/blocks/registry'
import { enterGuest, exitGuest } from '@/lib/data/mode'
import { pingBackend } from '@/lib/data/remote'
import { brand, landingTheme } from '@/styles/theme'

const GITHUB_URL = 'https://github.com/AbdulDevHub/'

const gradientText = {
  background: `linear-gradient(100deg, #C0EBFF 0%, ${brand.mint} 45%, #00FF95 100%)`,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
}

/** A glassy card used across the page */
const Card = ({ children, sx = {} }: { children: ReactNode; sx?: object }) => (
  <Box
    className="landing-card"
    sx={{
      position: 'relative',
      borderRadius: 4,
      p: { xs: 2.5, sm: 3 },
      border: '1px solid rgba(255,255,255,0.08)',
      background: 'linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015))',
      overflow: 'hidden',
      transition: 'border-color 200ms, transform 200ms',
      '&:hover': { borderColor: 'rgba(84,216,179,0.35)', transform: 'translateY(-2px)' },
      ...sx,
    }}
  >
    {children}
  </Box>
)

const FeatureTitle = ({ icon, title, text }: { icon: ReactNode; title: string; text: string }) => (
  <Box>
    <Box
      sx={{
        display: 'inline-grid',
        placeItems: 'center',
        width: 36,
        height: 36,
        borderRadius: 2,
        backgroundColor: 'rgba(84,216,179,0.12)',
        color: brand.mint,
        mb: 1.5,
      }}
    >
      {icon}
    </Box>
    <Box component="h3" sx={{ m: 0, fontSize: 19, fontWeight: 700, letterSpacing: '-0.01em' }}>
      {title}
    </Box>
    <Box
      component="p"
      sx={{ m: 0, mt: 0.75, color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.6 }}
    >
      {text}
    </Box>
  </Box>
)

/** A static copy of the editor's slash menu */
const SlashMenuMock = () => (
  <Box
    sx={{
      mt: 2.5,
      borderRadius: 2.5,
      border: '1px solid rgba(255,255,255,0.1)',
      backgroundColor: '#1E1E1E',
      p: 0.75,
      boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
    }}
  >
    <Box sx={{ px: 1.25, py: 0.75, fontSize: 14, color: 'rgba(255,255,255,0.9)' }}>
      /
      <Box
        component="span"
        sx={{ animation: 'opalBlink 1s steps(1) infinite', borderLeft: '2px solid', ml: '1px' }}
      />
    </Box>
    {BLOCK_OPTIONS.filter((o) =>
      ['Heading 1', 'Checkbox', 'Code Block', 'iFrame'].includes(o.type)
    ).map((option, i) => {
      const Icon = option.icon
      return (
        <Box
          key={option.type}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            px: 1,
            py: 0.75,
            borderRadius: 1.5,
            backgroundColor: i === 0 ? 'rgba(255,255,255,0.08)' : 'transparent',
          }}
        >
          <Box
            sx={{
              width: 34,
              height: 34,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 1.5,
              border: '1px solid rgba(255,255,255,0.1)',
              backgroundColor: '#252525',
            }}
          >
            <Icon sx={{ fontSize: 19, color: 'rgba(255,255,255,0.65)' }} />
          </Box>
          <Box>
            <Box sx={{ fontSize: 13, fontWeight: 500 }}>{option.label}</Box>
            <Box sx={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{option.description}</Box>
          </Box>
        </Box>
      )
    })}
  </Box>
)

/** Tiny view chart drawn with SVG */
const ChartMock = () => (
  <Box component="svg" viewBox="0 0 300 90" sx={{ width: '100%', height: 90, mt: 2 }} aria-hidden>
    <defs>
      <linearGradient id="landingChart" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={brand.mint} stopOpacity="0.45" />
        <stop offset="100%" stopColor={brand.mint} stopOpacity="0" />
      </linearGradient>
    </defs>
    <path
      d="M0 80 C 30 70, 50 72, 75 60 S 120 40, 150 48 S 200 20, 225 26 S 270 8, 300 4 L 300 90 L 0 90 Z"
      fill="url(#landingChart)"
    />
    <path
      d="M0 80 C 30 70, 50 72, 75 60 S 120 40, 150 48 S 200 20, 225 26 S 270 8, 300 4"
      fill="none"
      stroke={brand.mint}
      strokeWidth="2.5"
    />
  </Box>
)

const Kbd = ({ children }: { children: string }) => (
  <Box
    component="kbd"
    sx={{
      fontFamily: 'inherit',
      fontSize: 13,
      fontWeight: 600,
      px: 1,
      py: 0.5,
      borderRadius: 1.25,
      border: '1px solid rgba(255,255,255,0.15)',
      borderBottomWidth: 3,
      backgroundColor: 'rgba(255,255,255,0.06)',
    }}
  >
    {children}
  </Box>
)

/**
 * The marketing homepage. Visitors can try the app as a guest or sign in with Google.
 */
const HomePage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  // A signed-in visitor goes straight to their pages
  useEffect(() => {
    if (session) {
      // A real account always wins over a leftover guest flag
      exitGuest()
      router.push('/dashboard')
    }
  }, [session, router])

  // Wake the backend while the visitor reads the page (free hosting sleeps when idle)
  useEffect(() => {
    pingBackend()
  }, [])

  /** Signs in with Google, leaving guest mode so the account's pages are used */
  const handleGoogleSignIn = () => {
    exitGuest()
    signIn('google')
  }

  /** Opens the dashboard without an account; pages are saved in this browser */
  const handleTryAsGuest = () => {
    enterGuest()
    router.push('/dashboard')
  }

  const ctaButtons = (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
      <Button
        size="large"
        variant="contained"
        onClick={handleTryAsGuest}
        endIcon={<ArrowForwardIcon />}
        sx={{
          px: 3,
          py: 1.25,
          borderRadius: 2.5,
          fontWeight: 600,
          fontSize: 16,
          boxShadow: '0 8px 30px rgba(84,216,179,0.35)',
        }}
      >
        Demo
      </Button>
      <Button
        size="large"
        variant="outlined"
        onClick={handleGoogleSignIn}
        startIcon={<GoogleIcon />}
        sx={{
          px: 3,
          py: 1.25,
          borderRadius: 2.5,
          fontWeight: 600,
          fontSize: 16,
          color: '#fff',
          borderColor: 'rgba(255,255,255,0.2)',
          '&:hover': {
            borderColor: 'rgba(255,255,255,0.5)',
            backgroundColor: 'rgba(255,255,255,0.04)',
          },
        }}
      >
        Continue with Google
      </Button>
    </Box>
  )

  const sectionTitle = (eyebrow: string, title: ReactNode, text?: string) => (
    <Box sx={{ textAlign: 'center', maxWidth: 680, mx: 'auto', mb: { xs: 4, sm: 6 } }}>
      <Box
        sx={{
          color: brand.mint,
          fontWeight: 600,
          fontSize: 14,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          mb: 1.5,
        }}
      >
        {eyebrow}
      </Box>
      <Box
        component="h2"
        sx={{
          m: 0,
          fontSize: { xs: 32, sm: 44 },
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.1,
        }}
      >
        {title}
      </Box>
      {text && (
        <Box
          component="p"
          sx={{
            mt: 2,
            mb: 0,
            color: 'rgba(255,255,255,0.6)',
            fontSize: { xs: 16, sm: 18 },
            lineHeight: 1.6,
          }}
        >
          {text}
        </Box>
      )}
    </Box>
  )

  return (
    <ThemeProvider theme={landingTheme}>
      <CssBaseline />
      <Head>
        <title>Opal Labs · Notes that adapt to the way you think</title>
      </Head>

      <Box
        className="landing"
        sx={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#0B0B0C',
          color: '#fff',
          overflow: 'hidden',
        }}
      >
        {/* Background glow and grain */}
        <Box className="landing-aurora" aria-hidden />
        <Box className="landing-grain" aria-hidden />

        {/* ------------------ Navigation ------------------ */}
        <Box
          component="header"
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            backdropFilter: 'blur(14px) saturate(160%)',
            backgroundColor: 'rgba(11,11,12,0.55)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <Box
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2, sm: 3 },
              height: 64,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Image src="/images/opal.png" alt="" width={32} height={32} priority />
              <Box sx={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>Opal Labs</Box>
            </Box>
            <Box
              component="nav"
              aria-label="Sections"
              sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, ml: 3 }}
            >
              {[
                ['Features', '#features'],
                ['Use cases', '#use-cases'],
                ['Tech', '#tech'],
              ].map(([label, href]) => (
                <Button
                  key={label}
                  href={href}
                  color="inherit"
                  sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: '#fff' } }}
                >
                  {label}
                </Button>
              ))}
            </Box>
            <Box sx={{ flex: 1 }} />
            <Button
              color="inherit"
              onClick={handleGoogleSignIn}
              startIcon={<GoogleIcon fontSize="small" />}
              sx={{ display: { xs: 'none', sm: 'inline-flex' }, color: 'rgba(255,255,255,0.8)' }}
            >
              Log In
            </Button>
            <Button
              variant="contained"
              onClick={handleTryAsGuest}
              sx={{ borderRadius: 2, fontWeight: 600 }}
            >
              Demo
            </Button>
          </Box>
        </Box>

        <Box component="main" sx={{ position: 'relative', zIndex: 1 }}>
          {/* ------------------ Hero ------------------ */}
          <Box
            component="section"
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 8, sm: 12 },
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                px: 1.5,
                py: 0.5,
                mb: 3,
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 500,
                border: '1px solid rgba(84,216,179,0.3)',
                backgroundColor: 'rgba(84,216,179,0.08)',
                color: '#BFF5E4',
              }}
            >
              <AutoAwesomeIcon sx={{ fontSize: 15 }} /> New: slash commands, templates, page covers
              and dark mode
            </Box>
            <Box
              component="h1"
              sx={{
                m: 0,
                fontSize: { xs: 46, sm: 72, md: 84 },
                fontWeight: 850,
                letterSpacing: '-0.045em',
                lineHeight: 1.02,
              }}
            >
              Unleash Your{' '}
              <Box component="span" sx={gradientText}>
                Potential.
              </Box>
            </Box>
            <Box
              component="p"
              sx={{
                mx: 'auto',
                mt: 3,
                mb: 4,
                maxWidth: 640,
                fontSize: { xs: 18, sm: 21 },
                lineHeight: 1.55,
                color: 'rgba(255,255,255,0.65)',
              }}
            >
              Opal Labs is the flexible writing app that adapts to the way you think. Write in
              blocks, organise with nested pages and publish to the web in one click.
            </Box>
            {ctaButtons}
            <Box sx={{ mt: 2, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
              No account needed: guest pages are saved in your browser.
            </Box>

            {/* Product shot */}
            <Box sx={{ position: 'relative', mt: { xs: 7, sm: 9 }, mx: 'auto', maxWidth: 1080 }}>
              <Box
                aria-hidden
                sx={{
                  position: 'absolute',
                  inset: '8% 10% -6% 10%',
                  background: `radial-gradient(closest-side, ${brand.mint}55, transparent)`,
                  filter: 'blur(40px)',
                }}
              />
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: { xs: 2, sm: 3 },
                  overflow: 'hidden',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundColor: '#191919',
                  boxShadow: '0 40px 120px rgba(0,0,0,0.6)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.75,
                    px: 1.5,
                    height: 34,
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    backgroundColor: '#202020',
                  }}
                >
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((color) => (
                    <Box
                      key={color}
                      sx={{ width: 11, height: 11, borderRadius: '50%', backgroundColor: color }}
                    />
                  ))}
                  <Box
                    sx={{
                      flex: 1,
                      mx: 'auto',
                      maxWidth: 300,
                      height: 20,
                      borderRadius: 1,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.45)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    opal-labs.vercel.app
                  </Box>
                  <Box sx={{ width: 45 }} />
                </Box>
                <Image
                  src="/images/landing/editor-dark.png"
                  alt="The Opal Labs editor with a sidebar of pages and a project page with a cover, to-dos and a code block"
                  width={2400}
                  height={1400}
                  priority
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            </Box>
          </Box>

          {/* ------------------ Features ------------------ */}
          <Box
            component="section"
            id="features"
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 12, sm: 18 },
              scrollMarginTop: 64,
            }}
          >
            {sectionTitle(
              'Features',
              <>
                Everything you need to{' '}
                <Box component="span" sx={gradientText}>
                  spark brilliance
                </Box>
              </>,
              'From personal notes to journals, knowledge bases and project plans, Opal Labs gives you the tools to capture ideas and organise them.'
            )}

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              <Card sx={{ gridRow: { md: 'span 2' } }}>
                <FeatureTitle
                  icon={<Box sx={{ fontWeight: 800, fontSize: 18 }}>/</Box>}
                  title="Slash commands"
                  text="Type / anywhere to add headings, lists, to-dos, callouts, code, images, embeds or a live views chart."
                />
                <SlashMenuMock />
              </Card>
              <Card>
                <FeatureTitle
                  icon={<DragIndicatorIcon />}
                  title="Drag and drop blocks"
                  text="Grab the handle to reorder anything. Markdown shortcuts like # and - turn into blocks as you type."
                />
              </Card>
              <Card>
                <FeatureTitle
                  icon={<AccountTreeOutlinedIcon />}
                  title="Nested pages"
                  text="Group your thoughts into pages inside pages, with a tree in the sidebar and breadcrumbs on top."
                />
              </Card>
              <Card>
                <FeatureTitle
                  icon={<InsertChartOutlinedIcon />}
                  title="Publish and track views"
                  text="Share a read-only page with one switch, then watch the views roll in."
                />
                <ChartMock />
              </Card>
              <Card>
                <FeatureTitle
                  icon={<DarkModeOutlinedIcon />}
                  title="Light, dark or system"
                  text="A calm, distraction-free canvas that follows your OS theme. Add an emoji icon and a cover to every page."
                />
              </Card>
              <Card sx={{ gridColumn: { md: 'span 2' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 3,
                    alignItems: { sm: 'center' },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <FeatureTitle
                      icon={<Box sx={{ fontWeight: 700, fontSize: 13 }}>⌘K</Box>}
                      title="Keyboard first"
                      text="Jump to any page or run a command from the palette. Enter splits a block, Backspace merges, arrows move between blocks."
                    />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      color: 'rgba(255,255,255,0.55)',
                      fontSize: 13,
                    }}
                  >
                    <Kbd>Ctrl</Kbd>+<Kbd>K</Kbd>
                    <Box sx={{ width: 12 }} />
                    <Kbd>/</Kbd>
                    <Box sx={{ width: 12 }} />
                    <Kbd>Ctrl</Kbd>+<Kbd>⇧</Kbd>+<Kbd>↑</Kbd>
                  </Box>
                </Box>
              </Card>
              <Card>
                <FeatureTitle
                  icon={<FileDownloadOutlinedIcon />}
                  title="Templates and export"
                  text="Start from a to-do list, meeting notes, journal or project brief, and take your words with you as Markdown."
                />
              </Card>
            </Box>
          </Box>

          {/* ------------------ Publishing showcase ------------------ */}
          <Box
            component="section"
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 12, sm: 18 },
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '5fr 7fr' },
              gap: { xs: 4, md: 6 },
              alignItems: 'center',
            }}
          >
            <Box>
              <Box
                sx={{
                  color: brand.mint,
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  mb: 1.5,
                }}
              >
                Publish & share
              </Box>
              <Box
                component="h2"
                sx={{
                  m: 0,
                  fontSize: { xs: 32, sm: 44 },
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                }}
              >
                From private note to public page in one switch
              </Box>
              <Box
                component="p"
                sx={{ mt: 2, color: 'rgba(255,255,255,0.6)', fontSize: 18, lineHeight: 1.6 }}
              >
                Published pages get a clean reading view with a table of contents, light and dark
                themes, and a views chart you can drop into any page.
              </Box>
            </Box>
            <Box
              sx={{
                borderRadius: 3,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.5)',
              }}
            >
              <Image
                src="/images/landing/live-dark.png"
                alt="A published Opal Labs page with a cover, an icon and a table of contents"
                width={2880}
                height={1680}
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </Box>
          </Box>

          {/* ------------------ Use cases ------------------ */}
          <Box
            component="section"
            id="use-cases"
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 12, sm: 18 },
              scrollMarginTop: 64,
            }}
          >
            {sectionTitle('Use cases', 'One space for every part of your life')}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 2,
              }}
            >
              {[
                {
                  icon: <SelfImprovementOutlinedIcon />,
                  title: 'For Personal Use.',
                  text: 'Organise your thoughts, jot down ideas or keep a daily journal. Style your notes with colours, callouts and covers.',
                },
                {
                  icon: <SchoolOutlinedIcon />,
                  title: 'For School Use.',
                  text: 'Create sub-pages for every subject, embed lecture videos and slides, and track assignments with to-dos.',
                },
                {
                  icon: <WorkOutlineIcon />,
                  title: 'For Work Use.',
                  text: 'Write project briefs and meeting notes, share them as a public page and see how many people read them.',
                },
              ].map((item) => (
                <Card key={item.title}>
                  <FeatureTitle icon={item.icon} title={item.title} text={item.text} />
                </Card>
              ))}
            </Box>
          </Box>

          {/* ------------------ Tech ------------------ */}
          <Box
            component="section"
            id="tech"
            sx={{
              maxWidth: 1180,
              mx: 'auto',
              px: { xs: 2.5, sm: 3 },
              pt: { xs: 12, sm: 18 },
              scrollMarginTop: 64,
            }}
          >
            {sectionTitle(
              'Under the hood',
              'Built as a real full-stack product',
              'A Next.js and TypeScript frontend on Vercel talks to a Go API on Render backed by PostgreSQL. Guest mode runs the same app entirely in your browser.'
            )}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 1.25 }}>
              {[
                'Next.js',
                'React',
                'TypeScript',
                'Material UI',
                'dnd-kit',
                'Go',
                'Gin',
                'GORM',
                'PostgreSQL (Neon)',
                'NextAuth + JWT',
                'Playwright',
                'Vercel',
                'Render',
              ].map((tech) => (
                <Box
                  key={tech}
                  sx={{
                    px: 2,
                    py: 1,
                    borderRadius: 99,
                    fontSize: 14,
                    fontWeight: 500,
                    border: '1px solid rgba(255,255,255,0.1)',
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    color: 'rgba(255,255,255,0.8)',
                  }}
                >
                  {tech}
                </Box>
              ))}
            </Box>
          </Box>

          {/* ------------------ Call to action ------------------ */}
          <Box
            component="section"
            sx={{ maxWidth: 1180, mx: 'auto', px: { xs: 2.5, sm: 3 }, pt: { xs: 12, sm: 18 } }}
          >
            <Box
              sx={{
                position: 'relative',
                textAlign: 'center',
                borderRadius: 5,
                px: { xs: 3, sm: 6 },
                py: { xs: 7, sm: 10 },
                overflow: 'hidden',
                border: '1px solid rgba(84,216,179,0.25)',
                background:
                  'radial-gradient(120% 120% at 50% 0%, rgba(84,216,179,0.18), rgba(11,11,12,0) 60%), rgba(255,255,255,0.02)',
              }}
            >
              <Image
                src="/images/opal.png"
                alt=""
                width={72}
                height={72}
                style={{ display: 'block', margin: '0 auto 20px' }}
              />
              <Box
                component="h2"
                sx={{
                  m: 0,
                  mb: 1.5,
                  fontSize: { xs: 34, sm: 52 },
                  fontWeight: 850,
                  letterSpacing: '-0.035em',
                }}
              >
                It's your time to shine.
              </Box>
              <Box
                component="p"
                sx={{ mt: 0, mb: 4, color: 'rgba(255,255,255,0.6)', fontSize: 18 }}
              >
                Free for personal use. Start writing in seconds.
              </Box>
              {ctaButtons}
            </Box>
          </Box>
        </Box>

        {/* ------------------ Footer ------------------ */}
        <Box
          component="footer"
          sx={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1180,
            mx: 'auto',
            px: { xs: 2.5, sm: 3 },
            py: 6,
            mt: { xs: 8, sm: 12 },
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { sm: 'center' },
            gap: 3,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Image src="/images/opal.png" alt="" width={28} height={28} />
            <Box>
              <Box sx={{ fontWeight: 700 }}>Opal Labs</Box>
              <Box sx={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                © {new Date().getFullYear()} Opal Labs. All rights reserved.
              </Box>
            </Box>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box
            component="nav"
            aria-label="Follow us"
            className="footer-links"
            sx={{ display: 'flex', flexWrap: 'wrap', gap: { xs: 2, sm: 3 } }}
          >
            {[
              ['Portfolio', 'https://abdulhadikhan.netlify.app/'],
              ['LinkedIn', 'https://www.linkedin.com/in/abdul-hadi-khan/'],
              ['YouTube', 'https://www.youtube.com/@learningexpressway/videos'],
              ['GitHub', GITHUB_URL],
            ].map(([label, href]) => (
              <Box
                key={label}
                component="a"
                href={href}
                target="_blank"
                rel="noreferrer"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  color: 'rgba(255,255,255,0.65)',
                  textDecoration: 'none',
                  fontSize: 14,
                  '&:hover': { color: brand.mint },
                }}
              >
                {label === 'GitHub' && <GitHubIcon sx={{ fontSize: 16 }} />}
                {label}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default HomePage
