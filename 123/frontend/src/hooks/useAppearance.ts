import { createContext, useContext } from 'react'
import type { Appearance } from '../app/appearance'

export type AppearanceState = {
  appearance: Appearance
  setAppearance: (appearance: Appearance) => void
  persistenceError: boolean
}

export const AppearanceContext = createContext<AppearanceState | null>(null)

export function useAppearance() {
  const context = useContext(AppearanceContext)
  if (!context) throw new Error('useAppearance must be used within AppearanceProvider')
  return context
}
