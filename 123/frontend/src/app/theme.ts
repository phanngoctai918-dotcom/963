import { createTheme } from '@mui/material/styles'
import { appearancePalettes, type Appearance } from './appearance'

export function createAppTheme(appearance: Appearance) {
  const colors = appearancePalettes[appearance]
  return createTheme({
    palette: {
      mode: colors.mode,
      primary: { main: colors.strong, contrastText: colors.onStrong },
      secondary: { main: colors.secondary },
      background: { default: colors.background, paper: colors.surface },
      text: { primary: colors.text, secondary: colors.secondary },
      divider: colors.border,
    },
    typography: {
      fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif",
      button: { textTransform: 'none', fontWeight: 600 },
      h4: { fontWeight: 650, fontSize: '1.875rem', letterSpacing: '-0.8px' },
      h5: { fontWeight: 650 },
      body2: { fontSize: '0.875rem', lineHeight: 1.7 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { defaultProps: { disableElevation: true } },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTextField: { defaultProps: { size: 'small' } },
    },
  })
}
