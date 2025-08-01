import { BorderCreator } from '../lib/borderCreator'
import { MediaQueries } from '../lib/mediaQuery'
import type { DefaultVariants } from '../lib/defaultVariants'
import { MultiplierFunction, Spacings } from '../lib/spacing'
import { ICSS, IEffect } from './core'

type AnyMap = {
  [key: string]: any
}

export type ColorMap = {
  [key: string]: string
}

type BreakpointMap = {
  [key: string]: number
}

type EffectsMap = {
  [key: string]: IEffect
}

export type SpacingMap =
  Spacings<'margin'> &
  Spacings<'padding'> &
  Spacings<'m', string> &
  Spacings<'p', string> &
  {
    gap: MultiplierFunction
  }

export type InsetMap =
  {
    bottom: MultiplierFunction
    top: MultiplierFunction
    left: MultiplierFunction
    right: MultiplierFunction
  }

export type Theme = {
  baseColors: ColorMap
  colors: ColorMap
  alternateColors?: {
    [key: string]: ColorMap
  }
  breakpoints?: BreakpointMap
  baseSpacing?: number
  presets?: AnyMap
  radius?: AnyMap
  stroke?: AnyMap
  size?: AnyMap
  effects?: EffectsMap
  typography: AnyMap
  icons: AnyMap
  values?: AnyMap
  isBrowser?: boolean
}

export type DefaultColorSchemeName = 'default'

export type ColorScheme<T extends Theme = Theme> = DefaultColorSchemeName | keyof T['alternateColors']

type PredefinedThemeDerivedValues<T extends Theme> = {
  baseColors: T['baseColors']
  colors: T['colors']
  breakpoints: T['breakpoints']
  presets: DefaultVariants & T['presets']
  radius: T['radius']
  stroke: T['stroke']
  size: T['size']
  effects: T['effects']
  typography: T['typography']
  icons: T['icons']
  values: T['values']
}

type PredefinedAppTheme<T extends Theme> = PredefinedThemeDerivedValues<T> & {
  setColorScheme: (colorScheme: string) => void
  currentColorScheme: () => ColorScheme<T>
  injectColorScheme: (name: string, colorMap: ColorMap) => void
  spacing: SpacingMap
  media: MediaQueries
  border: BorderCreator
  inset: InsetMap
  baseSpacing: number
  value: (multiplier: number) => number
  sized: (size: number | string) => ICSS
}

export type AppTheme<T extends Theme> = PredefinedAppTheme<T> & {
  [P in Exclude<keyof T, keyof PredefinedThemeDerivedValues<T>>]: T[P]
}
