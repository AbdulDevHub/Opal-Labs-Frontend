import { Poppins } from 'next/font/google'

import { createTheme } from '@mui/material/styles'

const poppins = Poppins({ weight: ['400', '500', '600', '700'], subsets: ['latin'] })

export const base = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#9c27b0',
    },
    error: {
      main: '#ff574e',
    },
    warning: {
      main: '#ffa726',
    },
    info: {
      main: '#29b6f6',
    },
    success: {
      main: '#66bb6a',
    },
    divider: 'rgba(0, 0, 0, 0.1)',
    common: {
      white: '#e9e9e9',
      black: '#181818',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  zIndex: {
    mobileStepper: 1000,
    fab: 1050,
    speedDial: 1050,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    snackbar: 1400,
    tooltip: 1500,
  },
})

const typography = createTheme({
  typography: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 14,
    htmlFontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    button: {
      textTransform: 'none',
    },
  },
}).typography

const theme = createTheme(base, {
  typography: typography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {},
        img: {
          pointerEvents: 'none',
          webkitUserSelect: 'none',
          userSelect: 'none',
        },
        input: {
          '&:-webkit-autofill': {
            WebkitBoxShadow: `0 0 0 100px ${base.palette.background.default} inset !important`,
            WebkitTextFillColor: `${base.palette.text.primary} !important`,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        size: 'large',
      },
      styleOverrides: {
        root: {
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          minWidth: 0,
        },
      },
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            borderRadius: '0.5rem',
          },
        },
      ],
    },
    MuiContainer: {
      styleOverrides: {
        root: ({ ownerState }: any) => ({
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          padding: '0rem',
          gap: '1rem',
          ...(ownerState?.maxWidth === 'lg' && {
            maxWidth: 1400,
            [base.breakpoints.up('lg')]: {
              maxWidth: 1140,
              padding: '0rem',
            },
            [base.breakpoints.up('xl')]: {
              maxWidth: 1320,
            },
            [base.breakpoints.down('xl')]: {
              paddingLeft: '0px',
              paddingRight: '0px',
            },
          }),
        }),
      },
    },
  },
})

export default theme
