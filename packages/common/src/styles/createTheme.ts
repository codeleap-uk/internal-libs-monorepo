import { createBorderHelpers } from './helpers'

import { breakpointHooksFactory, buildMediaQueries } from './MediaQuery'
import { defaultPresets } from './presets'
import { spacingFactory } from './Spacing'
import { DynamicValueAccessors, EnhancedTheme, ThemeValues } from './types'

const defaultAccessors: DynamicValueAccessors = {
  screenSize: () => [0, 0],
}

/**
 * [[include:Theme.md]]
 */
export function createTheme<T extends ThemeValues>(
  values: T,
  accessors?: DynamicValueAccessors,
): EnhancedTheme<T> {
  const getters = { ...defaultAccessors, ...accessors }
  const isBrowser = !window?.process

  const initialTheme = values.initialTheme || Object.keys(values.colors)?.[0]

  if (!initialTheme || !values.colors[initialTheme]){
    throw new Error(`
      Could not load initial theme colors. make sure all keys of Theme.colors have a corresponding color set like:
      ...
      colors: {
        light: {
          // your colors here
        }
      }
      ...
      And that your initialTheme is correctly writen (if specified)  
    `)
  }
  return {
    ...values,
    theme: initialTheme,
    hooks: breakpointHooksFactory(values.breakpoints, getters.screenSize),
    media: buildMediaQueries(values.breakpoints),
    spacing: {
      base: values.spacing,
      ...spacingFactory(values.spacing, 'padding'),
      ...spacingFactory(values.spacing, 'margin'),
    },
    border: createBorderHelpers(values, isBrowser, initialTheme),
    presets: {
      ...defaultPresets,
      ...values.presets,
    },
    semiCircle: (side) => ({
      width: side,
      height: side,
      borderRadius: values.borderRadius.small,
    }),
    circle: (side) => ({
      width: side,
      height: side,
      borderRadius: values.borderRadius.large,
    }),
    square: (side) => ({
      width: side,
      height: side,
    }),
    sized: (size) => ({
      width: size * values.spacing,
      height: size * values.spacing,
    }),
    IsBrowser: isBrowser,
  }
}
