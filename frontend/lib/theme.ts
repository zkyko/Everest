import { createTheme, ThemeOptions } from '@mui/material/styles'

const baseTheme: ThemeOptions = {
  spacing: 8, // Fixed 8px grid
  palette: {
    primary: {
      main: '#1A1A1A', // Deeper Charcoal
      dark: '#000000',
      light: '#333333',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E67E22', // Refined Saffron/Carrot
      dark: '#D35400',
      light: '#F39C12',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#27AE60',
    },
    warning: {
      main: '#F1C40F',
    },
    error: {
      main: '#E74C3C',
    },
    info: {
      main: '#3498DB',
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 800,
      letterSpacing: '-0.03em',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: '1.75rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.01em',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: '0.02em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '0.95rem',
          boxShadow: 'none',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transform: 'translateY(-1px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        containedPrimary: {
          backgroundColor: '#1A1A1A',
          '&:hover': {
            backgroundColor: '#000000',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.08)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
          color: '#1A1A1A',
        },
      },
    },
  },
}

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'light',
    background: {
      default: '#FFFFFF',
      paper: '#FDFDFD',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666666',
    },
  },
})

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#FFFFFF', // Action items are light
      dark: '#F0F0F0',
      light: '#FFFFFF',
      contrastText: '#1A1A1A',
    },
    secondary: {
      main: '#E67E22', // Saffron
      dark: '#D35400',
      light: '#F39C12',
      contrastText: '#000000', // Better contrast on saffron
    },
    background: {
      default: '#0A0A0A',
      paper: '#141414',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#B0B0B0', // Darker for better contrast than A0
    },
    divider: 'rgba(255, 255, 255, 0.1)',
  },
  components: {
    ...baseTheme.components,
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.Mui-focusVisible': {
            outline: '2px solid #E67E22',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
          color: '#FFFFFF',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#141414',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
  },
})

export const statusColors = {
  low: '#27AE60',
  medium: '#F1C40F',
  high: '#E67E22',
  veryHigh: '#E74C3C',
}
