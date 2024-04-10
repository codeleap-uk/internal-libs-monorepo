import { AppTheme, ColorScheme, Theme } from '../types'
import { borderBuilder } from './borderBuilder'
import { buildMediaQueries } from './mediaQuery'
import { multiplierProperty } from './multiplierProperty'
import { defaultVariants } from './defaultVariants'
import { spacingFactory } from './spacing'
import { colorSchemaStore, themeStore } from './themeStore'

export const createTheme = <T extends Theme>(theme: T): AppTheme<T> => {
  colorSchemaStore.persist.rehydrate()
  
  console.log('COLOR SCHEMA', colorSchemaStore.getState().value)

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
      ...defaultVariants,
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

  themeStore.setState({ 
    current: themeObj, 
    colorScheme: themeObj.currentColorScheme as string 
  })

  return themeObj
}
