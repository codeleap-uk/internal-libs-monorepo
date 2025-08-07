import { AppTheme, Theme } from '../types'
import { borderCreator } from './borderCreator'
import { createMediaQueries } from './mediaQuery'
import { multiplierProperty } from './multiplierProperty'
import { defaultVariants } from './defaultVariants'
import { spacingFactory } from './spacing'
import { themeStore } from './themeStore'

type ThemePersistor = {
  get: (name: string) => any
  set: (name: string, value: any) => void
}

const colorSchemeKey = '@styles.theme.colorScheme'
const alternateColorsKey = '@styles.theme.alternateColors'

export const createTheme = <T extends Theme>(theme: T, themePersistor: ThemePersistor): AppTheme<T> => {
  const {
    colors,
    breakpoints,
    presets,
    radius,
    stroke,
    size,
    effects,
    typography,
    icons,
    baseColors,
    values,
    ...otherThemeValues
  } = theme

  themeStore.setColorScheme(themePersistor.get(colorSchemeKey) ?? 'default')

  const persistedAlternateColors = themePersistor.get(alternateColorsKey)

  const alternateColors = {
    ...(persistedAlternateColors ?? {}),
    ...otherThemeValues?.alternateColors,
  }

  themeStore.setAlternateColorsScheme(alternateColors)

  const themeObj: AppTheme<T> = {
    ...otherThemeValues,

    get alternateColors() {
      return themeStore.alternateColorsScheme
    },

    baseColors,

    currentColorScheme() {
      return themeStore.colorScheme
    },

    breakpoints: breakpoints ?? {},

    get colors() {
      const colorScheme = themeStore.colorScheme ?? 'default'

      if (colorScheme === 'default') return colors

      const scheme = themeStore.alternateColorsScheme?.[colorScheme]

      if (!scheme) {
        console.warn(`Color scheme ${colorScheme} not found in theme`)
      }

      return scheme ?? colors
    },

    setColorScheme(colorScheme: string) {
      const hasScheme = colorScheme === 'default' ? true : !!themeStore.alternateColorsScheme?.[colorScheme]

      if (!hasScheme) {
        console.warn(`Color scheme ${colorScheme} not found in theme`)
        return
      }

      themeStore.setColorScheme(colorScheme)

      themePersistor.set(colorSchemeKey, colorScheme)
    },

    injectColorScheme(name, colorMap) {
      themeStore.injectColorScheme(name, colorMap)

      const persistedAlternateColors = themePersistor.get(alternateColorsKey)

      const unpersistedAlternateColors = {
        ...(persistedAlternateColors ?? {}),
        [name]: colorMap,
      }

      themePersistor.set(alternateColorsKey, unpersistedAlternateColors)
    },
    ejectColorScheme(name) {
      themeStore.ejectColorScheme(name)

      const persistedAlternateColors = themePersistor.get(alternateColorsKey)

      if (name in persistedAlternateColors) {
        delete persistedAlternateColors[name]
      }

      themePersistor.set(alternateColorsKey, persistedAlternateColors)
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
      right: multiplierProperty(theme.baseSpacing, 'right'),
    },

    presets: {
      ...defaultVariants,
      ...presets,
    },

    radius: radius ?? {},

    stroke: stroke ?? {},

    size: size ?? {},

    effects: effects ?? {},

    media: createMediaQueries(breakpoints),

    border: borderCreator,

    typography: typography ?? {},

    icons: icons,

    values: values ?? {},

    sized: (size) => {
      const value = typeof size == 'number' ? size * theme.baseSpacing : size

      return {
        width: value,
        height: value,
      }
    },
  }

  themeStore.setTheme(themeObj)

  return themeObj
}
