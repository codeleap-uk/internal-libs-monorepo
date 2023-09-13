import { create } from 'zustand'
import { ITheme } from '../types'

type ThemeStore = {
  colorScheme: string
  setColorScheme: (theme: string) => void
  current: ITheme | null
  setTheme: (theme: ITheme) => void
}

export const themeStore = create<ThemeStore>((set) => ({
  colorScheme: 'default',
  setColorScheme(scheme) {
    set({ colorScheme: scheme })
  },
  setTheme(theme) {
    set({ current: theme })
  },

  current: null,
}))
