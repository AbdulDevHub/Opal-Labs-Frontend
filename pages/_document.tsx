import { Head, Html, Main, NextScript } from 'next/document'

/**
 * https://nextjs.org/docs/pages/building-your-application/routing/custom-document
 */

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

        {/* <link rel="canonical" href="TODO" /> */}

        <meta
          name="description"
          content="Opalescence is the all in one dashboard for productivity, management, and organization."
        />
        <meta
          name="keywords"
          content="Opalescence, Opalescence Dashboard, Productivity, Organization"
        />

        {/* <meta name="theme-color" content="TODO" /> */}

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Opalescence" />
        <meta
          property="og:description"
          content="Opalescence is the all in one dashboard for productivity, management, and organization."
        />

        {/*
            <meta property="og:image" content="/backgrounds/collage_close.jpg" />
            <meta property="twitter:image" content="/backgrounds/collage_close.jpg" />
            <meta name="twitter:card" content="summary_large_image" />

            <link rel="icon" type="image/svg+xml" sizes="512x512" href="/logo.svg" />
            <link rel="apple-touch-icon" href="/icons/apple.png" />
            <link rel="shortcut icon" href="/icons/favicon.ico" />
        */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
