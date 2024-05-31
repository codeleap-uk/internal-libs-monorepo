import { AppTheme, ColorScheme, Theme } from '../types'
import { borderCreator } from './borderCreator'
import { createMediaQueries } from './mediaQuery'
import { multiplierProperty } from './multiplierProperty'
import { defaultVariants } from './defaultVariants'
import { spacingFactory } from './spacing'
import { themeStore } from './themeStore'

type ColorSchemaPersistor = {
  get: () => string
  set: (colorSchema: string) => void
}

export const createTheme = <T extends Theme>(theme: T, colorSchemaPersistor: ColorSchemaPersistor): AppTheme<T> => {
  const themeObj:AppTheme<T> = {
    get currentColorScheme(): string {
      return themeStore.getState().colorScheme
    },

    breakpoints: theme.breakpoints ?? {},

    get colors() {
      const colorScheme = themeStore.getState().colorScheme

      if (colorScheme === 'default') return theme.colors
      
      return theme.alternateColors?.[colorScheme]
    },

    setColorScheme(colorScheme: ColorScheme<Theme>) {
      themeStore.setState({ colorScheme: colorScheme as string })
      colorSchemaPersistor.set(colorScheme as string)
    },

    baseSpacing: theme.baseSpacing,
    value: (n = 1) => theme.baseSpacing * n,

    spacing: {
      value: (n = 1) => theme.baseSpacing * n,
      gap: multiplierProperty(theme.baseSpacing, 'gap'),
      ...spacingFactory(theme.baseSpacing, 'padding'),
      ...spacingFactory(theme.baseSpacing, 'margin'),
      ...spacingFactory(theme.baseSpacing, 'p', true),
      ...spacingFactory(theme.baseSpacing, 'm', true),
    },

    inset: {
      top: multiplierProperty(theme.baseSpacing, 'top'),
      bottom: multiplierProperty(theme.baseSpacing, 'bottom'),
      left: multiplierProperty(theme.baseSpacing, 'left'),
      right: multiplierProperty(theme.baseSpacing, 'right')
    },

    presets: {
      ...defaultVariants,
      ...theme.presets,
    },

    borderRadius: theme.borderRadius ?? {},

    effects: theme.effects ?? {},

    media: createMediaQueries(theme.breakpoints),

    border: borderCreator,

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

  themeStore.setState({ 
    current: themeObj, 
    colorScheme: colorSchemaPersistor.get() ?? 'default'
  })

  return themeObj
}
