import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
import { AppearanceContext } from '../hooks/useAppearance'
import {
  APPEARANCE_STORAGE_KEY,
  appearancePalettes,
  isAppearance,
  readAppearance,
  type Appearance,
} from './appearance'
import { createAppTheme } from './theme'

export default function AppearanceProvider({ children }: { children: ReactNode }) {
  const [appearance, updateAppearance] = useState<Appearance>(readAppearance)
  const [persistenceError, setPersistenceError] = useState(false)
  const theme = useMemo(() => createAppTheme(appearance), [appearance])
  const colors = appearancePalettes[appearance]

  const setAppearance = useCallback((next: Appearance) => {
    updateAppearance(next)
    try {
      localStorage.setItem(APPEARANCE_STORAGE_KEY, next)
      setPersistenceError(false)
    } catch {
      setPersistenceError(true)
    }
  }, [])

  useEffect(() => {
    function synchronize(event: StorageEvent) {
      if (event.key === APPEARANCE_STORAGE_KEY) {
        updateAppearance(isAppearance(event.newValue) ? event.newValue : 'light')
      }
    }
    window.addEventListener('storage', synchronize)
    return () => window.removeEventListener('storage', synchronize)
  }, [])

  return (
    <AppearanceContext.Provider value={{ appearance, setAppearance, persistenceError }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            ':root': {
              colorScheme: colors.mode,
              '--app-bg': colors.background,
              '--surface': colors.surface,
              '--surface-muted': colors.muted,
              '--surface-hover': colors.hover,
              '--text-primary': colors.text,
              '--text-secondary': colors.secondary,
              '--border': colors.border,
              '--strong': colors.strong,
              '--on-strong': colors.onStrong,
              '--scene-bg': colors.scene,
              '--scene-grid': colors.grid,
              '--scene-node-dark': colors.nodeDark,
              '--scene-node-mid': colors.nodeMid,
              '--scene-node-light': colors.nodeLight,
            },
          }}
        />
        {children}
      </ThemeProvider>
    </AppearanceContext.Provider>
  )
}
