import { Head, Html, Main, NextScript } from 'next/document'

/**
 * https://nextjs.org/docs/pages/building-your-application/routing/custom-document
 */

const description =
  'Opal Labs is a fast, Notion-style notes app: slash commands, drag and drop blocks, sub-pages, dark mode and one-click publishing. Try it without signing in.'

// Runs before the first paint so dark-mode users don't see a white flash
const themeScript = `(function(){try{var p=localStorage.getItem('opal-theme');var d=p==='dark'||((!p||p==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light';}catch(e){}})();`

/**
 * Renders the Document component, which represents the HTML document structure for the application.
 *
 * @return {JSX.Element} The rendered Document component.
 */
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta
          name="keywords"
          content="Opal Labs, notes app, Notion alternative, block editor, productivity, Next.js, Go"
        />
        <meta name="theme-color" content="#101010" />

        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Opal Labs" />
        <meta property="og:title" content="Opal Labs: notes that adapt to the way you think" />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://opal-labs.vercel.app/images/Screenshot.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://opal-labs.vercel.app/images/Screenshot.png" />

        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/opal.png" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
