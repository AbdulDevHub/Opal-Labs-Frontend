import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CSSProperties, useEffect, useState } from 'react'

import { fontVariables } from '@/components/Landing/fonts'
import { magnetic } from '@/components/Landing/motion'
import OpalCanvas from '@/components/Landing/OpalCanvas'
import { enterGuest } from '@/lib/data/mode'
import { fontFamily } from '@/styles/theme'

import styles from '@/components/Landing/landing.module.css'
import nf from '@/components/Landing/notFound.module.css'

const QUIPS = [
  'This page polished itself into thin air.',
  'Even opals lose a facet now and then.',
  'The link was real. The page was a mirage.',
  'Somebody moved the rock this page lived under.',
]

const NotFound = () => {
  const router = useRouter()
  // The path and quip are only known in the browser (the page is pre-rendered once)
  const [path, setPath] = useState('')
  const [quip, setQuip] = useState(0)

  useEffect(() => {
    setPath(window.location.pathname)
    setQuip(Math.floor(Math.random() * QUIPS.length))
  }, [])

  const handleDemo = () => {
    enterGuest()
    router.push('/dashboard')
  }

  return (
    <div
      className={`${styles.page} ${nf.page} ${fontVariables}`}
      style={{ '--font-body': fontFamily } as CSSProperties}
    >
      <Head>
        <title>Page not found · Opal Labs</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className={styles.grain} aria-hidden />

      <header className={nf.top}>
        <Link href="/" className={`${styles.wordmark} ${nf.wordmark}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" width={26} height={26} />
          Opal Labs
        </Link>
        <span className={styles.mono}>(Error) Page not found</span>
      </header>

      <main className={nf.main}>
        <h1 className={nf.code} aria-label="404">
          <span className={`${nf.digit} ${styles.display}`} aria-hidden>
            4
          </span>
          <span className={nf.gemSlot} aria-hidden>
            <OpalCanvas className={nf.gem} label="" />
          </span>
          <span
            className={`${nf.digit} ${styles.display}`}
            style={{ animationDelay: '160ms' }}
            aria-hidden
          >
            4
          </span>
        </h1>

        <p className={`${nf.title} ${styles.display}`}>
          Lost in the <span className={`${styles.serif} ${styles.iris}`}>facets.</span>
        </p>
        <p className={nf.lede}>{QUIPS[quip]}</p>
        <p className={`${styles.mono} ${nf.path}`}>
          <span className={nf.pathLabel}>Looked for</span>
          <code>{path || '…'}</code>
        </p>

        <div className={nf.actions}>
          <Link href="/" className={styles.btn} {...magnetic}>
            Back home <span className={styles.arrow}>→</span>
          </Link>
          <Link href="/dashboard" className={styles.textLink}>
            My pages
          </Link>
          <button type="button" className={styles.textLink} onClick={handleDemo}>
            Try the demo
          </button>
        </div>
      </main>

      <div className={`${nf.marquee} ${styles.mono}`} aria-hidden>
        <div className={nf.track}>
          {Array.from({ length: 16 }, (_, i) => (
            <span key={i}>
              404 <span className={nf.star}>✦</span> Not found <span className={nf.star}>✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotFound
