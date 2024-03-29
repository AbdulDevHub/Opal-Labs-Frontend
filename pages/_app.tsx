import type { AppProps } from 'next/app'
import { SessionProvider } from "next-auth/react";

import CssBaseline from '@mui/material/CssBaseline'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles'

import Toast from '@/components/Shared/Toast'
import { APIProvider } from '@/contexts/API'
import { AuthProvider } from '@/contexts/Auth'
import { FeatureToggleProvider } from '@/contexts/FeatureToggle'
import { ToastProvider } from '@/contexts/Toast'
import theme from '@/styles/theme'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

import '../styles/global.css'

import '../types/extensions'

/**
 * https://nextjs.org/docs/pages/building-your-application/routing/custom-app
 */

/**
 * Renders the main application component with the provided props.
 *
 * This custom Next.js app component serves as the entry point for the application.
 * It provides context providers for API interactions, authentication, feature toggles,
 * and toast notifications. Additionally, it configures MUI theme and baseline CSS.
 * Lastly, it integrates with Next.js session management and React Query Devtools.
 * 
 * @param {AppProps} props - The props object containing the Component and pageProps.
 * @return {JSX.Element} The rendered application component.
 */
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <APIProvider>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            <ToastProvider>
              <FeatureToggleProvider>
                <AuthProvider>
                  <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                  </SessionProvider>
                  <Toast />
                </AuthProvider>
              </FeatureToggleProvider>
            </ToastProvider>
          </CssBaseline>
        </ThemeProvider>
      </StyledEngineProvider>
      <ReactQueryDevtools />
    </APIProvider>
  )
}
