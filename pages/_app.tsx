import type { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'

import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider } from '@mui/material/styles'

import Toast from '@/components/Shared/Toast'
import { ColorModeProvider } from '@/contexts/ColorMode'
import { ToastProvider } from '@/contexts/Toast'

import '../styles/global.css'

import '../types/extensions'

/**
 * https://nextjs.org/docs/pages/building-your-application/routing/custom-app
 */

/**
 * Renders the main application component with the provided props.
 *
 * Provides the MUI theme (light / dark / system), toast notifications and the NextAuth session.
 *
 * @param {AppProps} props - The props object containing the Component and pageProps.
 * @return {JSX.Element} The rendered application component.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ColorModeProvider>
        <CssBaseline />
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <ToastProvider>
          <SessionProvider session={pageProps.session}>
            <Component {...pageProps} />
          </SessionProvider>
          <Toast />
        </ToastProvider>
      </ColorModeProvider>
    </StyledEngineProvider>
  )
}
