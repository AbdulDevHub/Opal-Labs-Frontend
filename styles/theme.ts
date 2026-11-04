import { Inter } from 'next/font/google'

import { alpha, createTheme, Theme } from '@mui/material/styles'

export type Mode = 'light' | 'dark'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const fontFamily = `${inter.style.fontFamily}, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
export const monoFontFamily = '"JetBrains Mono", "Fira Code", Menlo, Consolas, monospace'

/** Opal brand colours (the logo's mint green) */
export const brand = {
  mint: '#54D8B3',
  mintDark: '#1A9E7E',
  sky: '#7CC8FF',
  violet: '#A78BFA',
}

declare module '@mui/material/styles' {
  interface Palette {
    sidebar: { background: string; hover: string; selected: string; text: string }
  }
  interface PaletteOptions {
    sidebar?: { background: string; hover: string; selected: string; text: string }
  }
}

/**
 * Builds the app theme for light or dark mode.
 * Colours are kept calm and neutral so the user's content stands out (Notion-like).
 */
export const getTheme = (mode: Mode): Theme => {
  const isDark = mode === 'dark'
  const primary = isDark ? brand.mint : brand.mintDark
  const textPrimary = isDark ? '#E8E8E6' : '#2F3437'
  const textSecondary = isDark ? '#9B9B98' : '#787774'

  return createTheme({
    palette: {
      mode,
      primary: { main: primary, contrastText: isDark ? '#062A20' : '#FFFFFF' },
      secondary: { main: brand.violet },
      error: { main: '#E5484D' },
      warning: { main: '#F5A524' },
      success: { main: '#3FA672' },
      background: {
        default: isDark ? '#191919' : '#FFFFFF',
        paper: isDark ? '#232323' : '#FFFFFF',
      },
      text: { primary: textPrimary, secondary: textSecondary },
      divider: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(55, 53, 47, 0.09)',
      action: {
        hover: isDark ? 'rgba(255, 255, 255, 0.055)' : 'rgba(55, 53, 47, 0.06)',
        selected: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(55, 53, 47, 0.09)',
      },
      sidebar: {
        background: isDark ? '#202020' : '#F7F7F5',
        hover: isDark ? 'rgba(255, 255, 255, 0.055)' : 'rgba(55, 53, 47, 0.06)',
        selected: isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(55, 53, 47, 0.09)',
        text: isDark ? '#CFCFCD' : '#5F5E5B',
      },
    },
    shape: { borderRadius: 8 },
    breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 } },
    typography: {
      fontFamily,
      fontSize: 14,
      button: { textTransform: 'none', fontWeight: 500 },
      h1: { fontWeight: 800, letterSpacing: '-0.03em' },
      h2: { fontWeight: 800, letterSpacing: '-0.025em' },
      h3: { fontWeight: 700, letterSpacing: '-0.02em' },
      h4: { fontWeight: 700, letterSpacing: '-0.015em' },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: isDark ? '#191919' : '#FFFFFF',
            WebkitFontSmoothing: 'antialiased',
          },
          '::selection': { background: alpha(brand.mint, isDark ? 0.35 : 0.3) },
          img: { userSelect: 'none' },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: { root: { borderRadius: 8 } },
      },
      MuiIconButton: {
        styleOverrides: { root: { borderRadius: 6 } },
      },
      MuiTooltip: {
        defaultProps: { arrow: false, enterDelay: 400 },
        styleOverrides: {
          tooltip: {
            fontSize: 12,
            fontWeight: 500,
            padding: '5px 8px',
            borderRadius: 6,
            backgroundColor: isDark ? '#3A3A3A' : '#1F1F1F',
          },
        },
      },
      MuiPaper: {
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiMenu: {
        styleOverrides: {
          paper: {
            borderRadius: 10,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(55,53,47,0.09)'}`,
            boxShadow: isDark
              ? '0 12px 32px rgba(0,0,0,0.5)'
              : '0 12px 32px rgba(15,15,15,0.12), 0 2px 6px rgba(15,15,15,0.06)',
          },
          list: { padding: 4 },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: { borderRadius: 6, fontSize: 14, minHeight: 32, gap: 10 },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            borderRadius: 12,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(55,53,47,0.09)'}`,
            boxShadow: isDark
              ? '0 12px 32px rgba(0,0,0,0.5)'
              : '0 12px 32px rgba(15,15,15,0.12), 0 2px 6px rgba(15,15,15,0.06)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 14 },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: { padding: 8 },
          track: { borderRadius: 11 },
          thumb: { boxShadow: 'none' },
        },
      },
    },
  })
}

/** The landing page is always dark, whatever the app theme is */
export const landingTheme = getTheme('dark')

export default getTheme('light')
