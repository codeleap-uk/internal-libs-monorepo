import { create } from 'zustand'
import { IAppVariants, ITheme } from '../types'

type ThemeStore = {
  colorScheme: string | null
  current: ITheme | null
  variants: IAppVariants
}

export const themeStore = create<ThemeStore>(() => ({
  colorScheme: null,
  current: null,
  variants: {},
}))
