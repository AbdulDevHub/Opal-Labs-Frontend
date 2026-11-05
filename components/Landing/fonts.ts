import { Bricolage_Grotesque, Instrument_Serif, JetBrains_Mono } from 'next/font/google'

// Poster typefaces shared by the homepage and the 404 page
export const display = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['wdth', 'opsz'],
  variable: '--font-display',
  display: 'swap',
  adjustFontFallback: false,
})

export const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
  adjustFontFallback: false,
})

export const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const fontVariables = `${display.variable} ${serif.variable} ${mono.variable}`
