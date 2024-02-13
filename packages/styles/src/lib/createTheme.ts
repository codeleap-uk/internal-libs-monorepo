import { AppTheme, ColorScheme, Theme } from '../types'
import { borderBuilder } from './borderBuilder'
import { buildMediaQueries } from './mediaQuery'
import { multiplierProperty } from './multiplierProperty'
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
      gap: multiplierProperty(theme.baseSpacing, 'gap'),
      ...spacingFactory(theme.baseSpacing, 'padding'),
      ...spacingFactory(theme.baseSpacing, 'margin'),
      ...spacingFactory(theme.baseSpacing, 'p', true),
      ...spacingFactory(theme.baseSpacing, 'm', true),
    },

    inset: {
      base: theme.baseSpacing,
      value: (multiplier: number) => (theme.baseSpacing * multiplier),
      top: multiplierProperty(theme.baseSpacing, 'top'),
      bottom: multiplierProperty(theme.baseSpacing, 'bottom'),
      left: multiplierProperty(theme.baseSpacing, 'left'),
      right: multiplierProperty(theme.baseSpacing, 'right')
    },

    presets: {
      ...defaultPresets,
      ...theme.presets,
    },

    borderRadius: theme.borderRadius ?? {},

    effects: theme.effects ?? {},

    media: buildMediaQueries(theme.breakpoints),

    border: borderBuilder,

    typography: theme.typography ?? {},

    icons: theme.icons,

    values: theme.values ?? {},

    sized: (size) => {
      const value = typeof size == 'number' ? size * theme.baseSpacing : size
      
      return {
        width: value,
        height: value,
      }
    },
  }

  themeStore.setState({ current: themeObj })

  return themeObj
}
