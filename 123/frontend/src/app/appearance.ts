export type Appearance = 'white' | 'light' | 'gray' | 'dark'

export const APPEARANCE_STORAGE_KEY = '3d-mlops-copilot.appearance.v1'

export const appearanceOptions: { id: Appearance; label: string; preview: string }[] = [
  { id: 'white', label: 'Trắng', preview: '#ffffff' },
  { id: 'light', label: 'Xám nhạt', preview: '#f0f0f0' },
  { id: 'gray', label: 'Xám đậm', preview: '#383838' },
  { id: 'dark', label: 'Đen', preview: '#121212' },
]

export const appearancePalettes = {
  white: {
    mode: 'light',
    background: '#ffffff',
    surface: '#ffffff',
    muted: '#f5f5f5',
    hover: '#ececec',
    text: '#191919',
    secondary: '#626262',
    border: '#dedede',
    strong: '#171717',
    onStrong: '#ffffff',
    scene: '#ffffff',
    grid: '#e0e0e0',
    nodeDark: '#292929',
    nodeMid: '#777777',
    nodeLight: '#aaaaaa',
  },
  light: {
    mode: 'light',
    background: '#f7f7f7',
    surface: '#ffffff',
    muted: '#f1f1f1',
    hover: '#e8e8e8',
    text: '#191919',
    secondary: '#6b6b6b',
    border: '#e2e2e2',
    strong: '#171717',
    onStrong: '#ffffff',
    scene: '#ffffff',
    grid: '#e3e3e3',
    nodeDark: '#292929',
    nodeMid: '#777777',
    nodeLight: '#aaaaaa',
  },
  gray: {
    mode: 'dark',
    background: '#383838',
    surface: '#424242',
    muted: '#4b4b4b',
    hover: '#555555',
    text: '#f5f5f5',
    secondary: '#d0d0d0',
    border: '#656565',
    strong: '#f2f2f2',
    onStrong: '#202020',
    scene: '#3b3b3b',
    grid: '#565656',
    nodeDark: '#f3f3f3',
    nodeMid: '#bfbfbf',
    nodeLight: '#8f8f8f',
  },
  dark: {
    mode: 'dark',
    background: '#121212',
    surface: '#1c1c1c',
    muted: '#252525',
    hover: '#303030',
    text: '#f5f5f5',
    secondary: '#b6b6b6',
    border: '#383838',
    strong: '#f2f2f2',
    onStrong: '#171717',
    scene: '#161616',
    grid: '#333333',
    nodeDark: '#f3f3f3',
    nodeMid: '#a5a5a5',
    nodeLight: '#696969',
  },
} as const

export function isAppearance(value: unknown): value is Appearance {
  return typeof value === 'string' && appearanceOptions.some((option) => option.id === value)
}

export function readAppearance(): Appearance {
  try {
    const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY)
    return isAppearance(saved) ? saved : 'light'
  } catch {
    return 'light'
  }
}
