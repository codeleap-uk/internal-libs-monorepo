import { TypeGuards } from '@codeleap/common'
import { AppTheme, ColorScheme, Theme } from '../types'
import { themeStore } from './themeStore'

type AppColorSchema = {
  get: () => string
  set: (colorSchema: ColorScheme<Theme>) => string
}

export const createTheme = <T extends Theme>(theme: T, appColorSchema: AppColorSchema): AppTheme<T> => {
  const themeObj:AppTheme<T> = {
    get currentColorScheme() {
      const colorSchemaTheme = appColorSchema?.get?.()
      const colorScheme = themeStore.getState().colorScheme

      if (colorScheme == null && TypeGuards.isString(colorSchemaTheme)) {
        return colorSchemaTheme
      }

      return colorScheme ?? 'default'
    },
    breakpoints: theme.breakpoints,
    get colors() {
      const colorSchemaTheme = appColorSchema?.get?.()
      let colorScheme = themeStore.getState().colorScheme

      if (colorScheme == null && TypeGuards.isString(colorSchemaTheme)) {
        colorScheme = colorSchemaTheme
      }

      if (colorScheme === 'default') return theme.colors
      
      return theme.alternateColors?.[colorScheme]
    },
    setColorScheme(colorScheme: ColorScheme<Theme>) {
      themeStore.getState().setColorScheme(colorScheme as string)
      appColorSchema?.set?.(colorScheme)
    },
  }

  themeStore.getState().setTheme(themeObj)

  return themeObj
}
