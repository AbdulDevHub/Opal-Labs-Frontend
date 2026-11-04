import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'

import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'

import Toast from '@/components/Shared/Toast'
import { ToastProvider } from '@/contexts/Toast'
import theme from '@/styles/theme'

import '../styles/global.css'

import '../types/extensions'

/**
 * https://nextjs.org/docs/pages/building-your-application/routing/custom-app
 */

/**
 * Renders the main application component with the provided props.
 *
 * Provides the MUI theme, toast notifications and the NextAuth session.
 *
 * @param {AppProps} props - The props object containing the Component and pageProps.
 * @return {JSX.Element} The rendered application component.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline>
          <ToastProvider>
            <SessionProvider session={pageProps.session}>
              <Component {...pageProps} />
            </SessionProvider>
            <Toast />
          </ToastProvider>
        </CssBaseline>
      </ThemeProvider>
    </StyledEngineProvider>
  )
}
