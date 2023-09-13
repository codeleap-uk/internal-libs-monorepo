import { AppTheme, ColorScheme, Theme } from '../types'
import { themeStore } from './themeStore'

export const createTheme = <T extends Theme>(theme: T): AppTheme<T> => {
  const themeObj:AppTheme<T> = {
    get currentColorScheme() {
      return themeStore.getState().colorScheme
    },
    breakpoints: theme.breakpoints,
    get colors() {
      const colorScheme = themeStore.getState().colorScheme
      if (colorScheme === 'default') return theme.colors
      return theme.alternateColors?.[colorScheme]
    },
    setColorScheme(colorScheme: ColorScheme<Theme>) {
      themeStore.getState().setColorScheme(colorScheme as string)
    },
  }

  themeStore.getState().setTheme(themeObj)

  return themeObj
}
