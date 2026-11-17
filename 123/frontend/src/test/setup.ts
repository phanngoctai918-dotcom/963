import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

const jsdomWindow = (
  globalThis as typeof globalThis & { jsdom?: { window: Window & { Storage: typeof Storage } } }
).jsdom?.window
if (!jsdomWindow) throw new Error('The Vitest jsdom environment is required.')

Object.defineProperty(globalThis, 'localStorage', {
  configurable: true,
  value: jsdomWindow.localStorage,
})
Object.defineProperty(globalThis, 'Storage', {
  configurable: true,
  value: jsdomWindow.Storage,
})

// jsdom lacks CSS.escape, which user-event uses to locate native radio groups.
if (!globalThis.CSS?.escape) {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {
      escape(value: string) {
        return Array.from(value, (character, index) => {
          const code = character.charCodeAt(0)
          if (code === 0) return '\uFFFD'
          if (
            code < 32 ||
            code === 127 ||
            (/\d/.test(character) && (index === 0 || (index === 1 && value[0] === '-')))
          )
            return `\\${code.toString(16)} `
          if (character === '-' && value.length === 1) return '\\-'
          return code >= 128 || /[\w-]/.test(character) ? character : `\\${character}`
        }).join('')
      },
    },
  })
}

beforeEach(() => localStorage.clear())
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  localStorage.clear()
})
