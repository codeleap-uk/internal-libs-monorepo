import { AppTheme, ColorScheme, Theme } from '../types'
import { borderCreator } from './borderCreator'
import { createMediaQueries } from './mediaQuery'
import { multiplierProperty } from './multiplierProperty'
import { defaultVariants } from './defaultVariants'
import { spacingFactory } from './spacing'
import { colorSchemaStore, themeStore } from './themeStore'

export const createTheme = <T extends Theme>(theme: T): AppTheme<T> => {
  colorSchemaStore.persist.rehydrate()
  
  const themeObj:AppTheme<T> = {
    get currentColorScheme(): string {
      return colorSchemaStore.getState().value
    },

    breakpoints: theme.breakpoints ?? {},

    get colors() {
      const colorScheme = colorSchemaStore.getState().value

      if (colorScheme === 'default') return theme.colors
      
      return theme.alternateColors?.[colorScheme]
    },

    setColorScheme(colorScheme: ColorScheme<Theme>) {
      themeStore.setState({ colorScheme: colorScheme as string })
      colorSchemaStore.setState({ value: colorScheme as string  })
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
    colorScheme: themeObj.currentColorScheme as string 
  })

  return themeObj
}
