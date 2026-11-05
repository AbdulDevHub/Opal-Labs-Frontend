import dynamic from 'next/dynamic'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { signIn, useSession } from 'next-auth/react'
import { CSSProperties, useEffect, useRef } from 'react'

import { fontVariables } from '@/components/Landing/fonts'
import { magnetic, useCountUp, useReveal, useScrollProgress } from '@/components/Landing/motion'
import OpalCanvas from '@/components/Landing/OpalCanvas'
import { useColorMode } from '@/contexts/ColorMode'
import { enterGuest, exitGuest } from '@/lib/data/mode'
import { pingBackend } from '@/lib/data/remote'
import { fontFamily } from '@/styles/theme'

import styles from '@/components/Landing/landing.module.css'

// The playground loads the whole editor, so it is fetched after the page is up
const LiveDemo = dynamic(() => import('@/components/Landing/LiveDemo'), {
  ssr: false,
  loading: () => <div className={styles.demoSkeleton} />,
})

const MARQUEE = [
  'Headings',
  'To-dos',
  'Code',
  'Callouts',
  'Embeds',
  'Sub-pages',
  'Covers',
  'Dark mode',
  'Publishing',
  'Analytics',
  'Templates',
  'Markdown',
]

const FEATURES = [
  [
    'Slash commands',
    'Type / to drop in headings, to-dos, quotes, callouts, code, images, embeds or a live views chart.',
  ],
  [
    'Drag & drop',
    'Grab any block by its handle and put it where it belongs. Markdown shortcuts turn into blocks as you type.',
  ],
  [
    'Pages in pages',
    'Nest pages as deep as your thinking goes, with a sidebar tree and breadcrumbs to find your way back.',
  ],
  [
    'Publish & track',
    'Flip one switch to share a clean, read-only page, then watch the views roll in.',
  ],
  [
    'Make it yours',
    'Emoji icons, gradient covers, colours, light and dark themes, full-width pages and starter templates.',
  ],
  [
    'Keyboard first',
    'Ctrl K jumps anywhere. Enter splits, Backspace merges, arrows glide between blocks.',
  ],
]

const USES = [
  [
    'Personal.',
    'Organise your thoughts, jot down ideas or keep a daily journal, styled with colours, callouts and covers.',
  ],
  [
    'School.',
    'A sub-page for every subject, lecture videos embedded next to your notes, assignments tracked with to-dos.',
  ],
  [
    'Work.',
    'Project briefs and meeting notes your team can read on a public link, with a chart of who’s been reading.',
  ],
]

const SPECS = [
  ['Interface', 'Next.js · React · TypeScript'],
  ['Components', 'Material UI · dnd-kit · Recharts'],
  ['Type', 'Bricolage Grotesque · Instrument Serif · Inter'],
  ['Server', 'Go · Gin · GORM'],
  ['Data', 'PostgreSQL on Neon'],
  ['Identity', 'Google OAuth · NextAuth · JWT'],
  ['Quality', 'Playwright · Storybook · GitHub Actions'],
  ['Hosting', 'Vercel · Render'],
]

const LINKS = [
  ['Portfolio', 'https://abdulhadikhan.netlify.app/'],
  ['LinkedIn', 'https://www.linkedin.com/in/abdul-hadi-khan/'],
  ['YouTube', 'https://www.youtube.com/@learningexpressway/videos'],
  ['GitHub', 'https://github.com/AbdulDevHub/'],
]

const Stat = ({ to, label }: { to: number; label: string }) => {
  const { ref, value } = useCountUp(to)
  return (
    <div className={styles.stat} data-reveal>
      <span ref={ref} className={`${styles.statValue} ${styles.display}`}>
        {value}
      </span>
      <span className={`${styles.statLabel} ${styles.mono}`}>{label}</span>
    </div>
  )
}

/** Spinning circular "try the demo" stamp */
const Badge = ({ onClick }: { onClick: () => void }) => (
  <button type="button" className={styles.badge} onClick={onClick} aria-label="Open the demo">
    <svg viewBox="0 0 120 120" aria-hidden>
      <defs>
        <path id="badgeCircle" d="M60,60 m-48,0 a48,48 0 1,1 96,0 a48,48 0 1,1 -96,0" />
      </defs>
      <text fontFamily="var(--font-mono)" fontSize="10.4" letterSpacing="2.6" fill="currentColor">
        <textPath href="#badgeCircle">TRY THE DEMO ✦ NO SIGN-UP ✦ FREE ✦ </textPath>
      </text>
    </svg>
    <span className={styles.badgeCore}>→</span>
  </button>
)

/**
 * The homepage: an editorial poster with a living opal, a playable editor and the product story.
 */
const HomePage = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const pageRef = useRef<HTMLDivElement>(null)
  const { ref: stageRef, progress } = useScrollProgress<HTMLDivElement>()
  useReveal(pageRef)
  const colorMode = useColorMode()

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
  const handleDemo = () => {
    enterGuest()
    router.push('/dashboard')
  }

  const marqueeTrack = (
    <div className={styles.track}>
      {[...MARQUEE, ...MARQUEE].map((word, i) => (
        <span key={i}>
          {word} <span className={styles.star}>✦</span>
        </span>
      ))}
    </div>
  )

  const frameStyle = {
    transform: `rotateX(${(1 - progress) * 24}deg) scale(${0.86 + progress * 0.14})`,
  } as CSSProperties

  return (
    <div
      ref={pageRef}
      className={`${styles.page} ${fontVariables}`}
      style={{ '--font-body': fontFamily } as CSSProperties}
    >
      <Head>
        <title>Opal Labs · Notes, but alive</title>
        <meta name="theme-color" content="#efebe3" />
      </Head>
      <div className={styles.grain} aria-hidden />

      {/* ------------------------------ Navigation ------------------------------ */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" className={styles.navLogo} />
      <header className={styles.nav}>
        <a href="#top" className={styles.wordmark}>
          Opal Labs
        </a>
        <nav className={`${styles.navLinks} ${styles.mono}`} aria-label="Sections">
          <a href="#playground">Playground</a>
          <a href="#features">Features</a>
          <a href="#colophon">Colophon</a>
        </nav>
        <button
          type="button"
          className={`${styles.navLink} ${styles.mono}`}
          onClick={handleGoogleSignIn}
        >
          Log In
        </button>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={colorMode.toggle}
          aria-label={colorMode.mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={colorMode.mode === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {colorMode.mode === 'dark' ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <circle cx="12" cy="12" r="4.2" />
              <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden>
              <path d="M20.5 14.2A8.5 8.5 0 1 1 9.8 3.5a6.8 6.8 0 0 0 10.7 10.7Z" />
            </svg>
          )}
        </button>
        <button type="button" className={styles.navPill} onClick={handleDemo} {...magnetic}>
          Demo
        </button>
      </header>

      <main id="top">
        {/* ------------------------------ Hero ------------------------------ */}
        <section className={styles.hero}>
          <div className={`${styles.heroMeta} ${styles.mono}`}>
            <span>(Opal Labs) Notes, but alive</span>
            <span>Blocks · Pages · Publishing</span>
            <span>Est. 2024 ↓</span>
          </div>

          <OpalCanvas className={styles.heroOrb} />

          <h1 className={`${styles.headline} ${styles.display}`}>
            <span className={`${styles.line} ${styles.blend}`}>
              <span className={styles.lineInner}>Unleash</span>
            </span>{' '}
            <span className={`${styles.line} ${styles.blend} ${styles.indent}`}>
              <span
                className={`${styles.lineInner} ${styles.serif}`}
                style={{ animationDelay: '120ms' }}
              >
                your
              </span>
            </span>{' '}
            <span className={styles.line}>
              <span
                className={`${styles.lineInner} ${styles.iris}`}
                style={{ animationDelay: '240ms' }}
              >
                potential.
              </span>
            </span>
          </h1>

          <div className={styles.heroFoot}>
            <p className={styles.lede}>
              Opal Labs is the flexible writing app that adapts to the way you think.{' '}
              <strong>Write in blocks, nest pages inside pages and publish in one click.</strong> No
              sign-up needed to try it.
            </p>
            <Badge onClick={handleDemo} />
            <div className={styles.actions}>
              <button type="button" className={styles.textLink} onClick={handleGoogleSignIn}>
                Continue with Google
              </button>
              <button type="button" className={styles.btn} onClick={handleDemo} {...magnetic}>
                Demo <span className={styles.arrow}>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* ------------------------------ Marquee ------------------------------ */}
        <div className={styles.marquee} aria-hidden>
          <div className={`${styles.band} ${styles.bandIris} ${styles.display}`}>
            {marqueeTrack}
          </div>
          <div className={`${styles.band} ${styles.bandInk} ${styles.display}`}>{marqueeTrack}</div>
        </div>

        {/* ------------------------------ Playground ------------------------------ */}
        <section id="playground" className={`${styles.section} ${styles.onInk}`}>
          <div className={`${styles.label} ${styles.mono}`}>(01) Playground</div>
          <div className={styles.demoGrid}>
            <div data-reveal>
              <h2 className={`${styles.h2} ${styles.display}`}>
                Don’t take our word for it.{' '}
                <span className={`${styles.serif} ${styles.iris}`}>Type.</span>
              </h2>
              <ul className={styles.hints}>
                {[
                  ['Insert any block', '/'],
                  ['Heading', '# + space'],
                  ['Bulleted list', '- + space'],
                  ['Move a block', 'drag ⋮⋮'],
                  ['Bold the line', 'Ctrl + B'],
                  ['Split · merge', 'Enter · ⌫'],
                ].map(([label, keys]) => (
                  <li key={label}>
                    {label}
                    <span className={styles.kbd}>{keys}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div data-reveal>
              <LiveDemo />
            </div>
          </div>
        </section>

        {/* ------------------------------ Features ------------------------------ */}
        <section id="features" className={styles.section}>
          <div className={`${styles.label} ${styles.mono}`}>(02) Inside</div>
          <h2 className={`${styles.h2} ${styles.display}`} data-reveal>
            Everything you need to{' '}
            <span className={`${styles.serif} ${styles.iris}`}>spark brilliance.</span>
          </h2>
          <ol className={styles.index}>
            {FEATURES.map(([title, text], i) => (
              <li key={title} className={styles.row} data-reveal>
                <span className={`${styles.rowNum} ${styles.mono}`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`${styles.rowTitle} ${styles.display}`}>{title}</h3>
                <p className={styles.rowText}>{text}</p>
                <span className={styles.rowArrow} aria-hidden>
                  →
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------ Showcase ------------------------------ */}
        <section className={styles.section} style={{ paddingTop: 0 }}>
          <div className={`${styles.label} ${styles.mono}`}>(03) The workspace</div>
          <h2 className={`${styles.h2} ${styles.display}`} data-reveal>
            Calm on the surface. <span className={styles.serif}>Serious underneath.</span>
          </h2>
          <div ref={stageRef} className={styles.stage}>
            <div className={styles.frame} style={frameStyle}>
              <div className={styles.frameBar} aria-hidden>
                <i />
                <i />
                <i />
                <span className={styles.frameUrl}>opal-labs.vercel.app</span>
              </div>
              {/* The opposite theme's screenshot stands out against the page */}
              <Image
                className={styles.shotDark}
                src="/images/landing/editor-dark.png"
                alt="The Opal Labs workspace: a page tree in the sidebar and a project page with a cover, to-dos and sub-pages"
                width={2880}
                height={1680}
                sizes="(max-width: 900px) 100vw, 1300px"
                style={{ width: '100%', height: 'auto' }}
              />
              <Image
                className={styles.shotLight}
                src="/images/landing/editor-light.png"
                alt="The Opal Labs workspace in light mode"
                width={2880}
                height={1680}
                sizes="(max-width: 900px) 100vw, 1300px"
                style={{ width: '100%', height: 'auto' }}
              />
            </div>
          </div>
          <div className={styles.stats}>
            <Stat to={15} label="Block types" />
            <Stat to={7} label="Devs built v1" />
            <Stat to={0} label="Sign-ups to try" />
            <Stat to={1} label="Click to publish" />
          </div>
        </section>

        {/* ------------------------------ Use cases ------------------------------ */}
        <section className={`${styles.section} ${styles.onInk}`}>
          <div className={`${styles.label} ${styles.mono}`}>(04) Made for</div>
          <h2 className={`${styles.h2} ${styles.display}`} data-reveal>
            One space for every part of your life.
          </h2>
          <div className={styles.uses}>
            {USES.map(([word, text]) => (
              <div key={word} className={styles.use} data-reveal>
                <h3 className={`${styles.useWord} ${styles.serif}`}>{word}</h3>
                <p className={styles.useText}>{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ------------------------------ Colophon ------------------------------ */}
        <section id="colophon" className={styles.section}>
          <div className={`${styles.label} ${styles.mono}`}>(05) Colophon</div>
          <div className={styles.colophon}>
            <div data-reveal>
              <h2 className={`${styles.h2} ${styles.serif}`}>How it’s made.</h2>
              <p className={styles.colophonNote}>
                A full-stack product, not a mock-up: a typed React front end, a Go API and a
                Postgres database, tested end to end on every push. Guest mode runs the same app
                entirely in your browser.
              </p>
            </div>
            <dl className={styles.specs} data-reveal>
              {SPECS.map(([term, value]) => (
                <div key={term} className={styles.spec}>
                  <dt className={styles.mono}>{term}</dt>
                  <span className={styles.leader} aria-hidden />
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ------------------------------ Call to action ------------------------------ */}
        <section className={`${styles.section} ${styles.onInk} ${styles.cta}`}>
          <OpalCanvas className={styles.ctaOrb} label="A large animated opal" />
          <h2 className={`${styles.ctaTitle} ${styles.display}`}>
            <span className={styles.blend}>
              It's your time to <span className={styles.serif}>shine.</span>
            </span>
          </h2>
          <p className={`${styles.ctaSub} ${styles.mono}`}>
            Free for personal use · Ready in seconds
          </p>
          <div className={styles.ctaActions}>
            <button type="button" className={styles.btn} onClick={handleDemo} {...magnetic}>
              Demo <span className={styles.arrow}>→</span>
            </button>
            <button type="button" className={styles.textLink} onClick={handleGoogleSignIn}>
              Continue with Google
            </button>
          </div>
        </section>
      </main>

      {/* ------------------------------ Footer ------------------------------ */}
      <footer className={`${styles.footer} ${styles.onInk}`}>
        <div className={`${styles.footerRow} ${styles.mono}`}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="" width={18} height={18} />©{' '}
            {new Date().getFullYear()} Opal Labs
          </span>
          <nav className={styles.footerLinks} aria-label="Follow us">
            {LINKS.map(([label, href]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer">
                {label} ↗
              </a>
            ))}
          </nav>
          <a href="#top" style={{ color: 'inherit', textDecoration: 'none' }}>
            Back to top ↑
          </a>
        </div>
        <span className={`${styles.giant} ${styles.display}`} aria-hidden>
          Opal Labs
        </span>
      </footer>
    </div>
  )
}

export default HomePage
