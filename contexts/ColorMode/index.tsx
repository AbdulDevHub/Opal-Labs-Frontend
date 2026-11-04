import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ThemeProvider } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

import { getTheme, Mode as PaletteMode } from '@/styles/theme'

export type ColorPreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'opal-theme'

type ColorModeValue = {
  /** The mode actually shown */
  mode: PaletteMode
  /** What the user picked (system follows the OS setting) */
  preference: ColorPreference
  setPreference: (preference: ColorPreference) => void
  /** Flips between light and dark */
  toggle: () => void
}

const ColorModeContext = createContext<ColorModeValue | undefined>(undefined)

export const useColorMode = () => {
  const context = useContext(ColorModeContext)
  if (!context) throw new Error('useColorMode must be used within ColorModeProvider')
  return context
}

/**
 * Provides the MUI theme for the app with a light / dark / system preference saved in localStorage.
 */
export const ColorModeProvider = ({ children }: { children: ReactNode }) => {
  const systemDark = useMediaQuery('(prefers-color-scheme: dark)')
  const [preference, setPreferenceState] = useState<ColorPreference>('system')

  // Read the saved preference after mount so the server and client render the same markup first
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'light' || saved === 'dark' || saved === 'system') setPreferenceState(saved)
    } catch {
      // storage blocked: keep following the system
    }
  }, [])

  const mode: PaletteMode = preference === 'system' ? (systemDark ? 'dark' : 'light') : preference

  // Lets the pre-paint script in _document pick the right background on the next load
  useEffect(() => {
    document.documentElement.dataset.theme = mode
    document.documentElement.style.colorScheme = mode
  }, [mode])

  const setPreference = useCallback((next: ColorPreference) => {
    setPreferenceState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // not saved, still applied for this visit
    }
  }, [])

  const toggle = useCallback(
    () => setPreference(mode === 'dark' ? 'light' : 'dark'),
    [mode, setPreference]
  )

  const theme = useMemo(() => getTheme(mode), [mode])
  const value = useMemo(
    () => ({ mode, preference, setPreference, toggle }),
    [mode, preference, setPreference, toggle]
  )

  return (
    <ColorModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  )
}
