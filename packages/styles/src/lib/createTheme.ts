import { AppTheme, ColorScheme, Theme } from '../types'
import { borderBuilder } from './borderBuilder'
import { buildMediaQueries } from './mediaQuery'
import { defaultPresets } from './presets'
import { spacingFactory } from './spacing'
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

      if (colorScheme == null && typeof colorSchemaTheme === 'string') {
        return colorSchemaTheme
      }

      return colorScheme ?? 'default'
    },

    breakpoints: theme.breakpoints ?? {},

    get colors() {
      const colorSchemaTheme = appColorSchema?.get?.()
      let colorScheme = themeStore.getState().colorScheme

      if (colorScheme == null && typeof colorSchemaTheme === 'string') {
        colorScheme = colorSchemaTheme
      }

      if (!colorScheme) {
        colorScheme = 'default'
      }

      if (colorScheme === 'default') return theme.colors
      
      return theme.alternateColors?.[colorScheme]
    },

    setColorScheme(colorScheme: ColorScheme<Theme>) {
      themeStore.setState({ colorScheme: colorScheme as string })
      appColorSchema?.set?.(colorScheme)
    },

    spacing: {
      base: theme.baseSpacing,
      ...spacingFactory(theme.baseSpacing, 'padding'),
      ...spacingFactory(theme.baseSpacing, 'margin'),
      ...spacingFactory(theme.baseSpacing, 'gap'),
    },

    presets: {
      ...defaultPresets,
      ...theme.presets,
    },

    borderRadius: theme.borderRadius ?? {},

    effects: theme.effects ?? {},

    media: buildMediaQueries(theme.breakpoints),

    border: borderBuilder
  }

  themeStore.setState({ current: themeObj })

  return themeObj
}
