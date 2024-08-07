import { BorderCreator } from '../lib/borderCreator'
import { MediaQueries } from '../lib/mediaQuery'
import type { DefaultVariants } from '../lib/defaultVariants'
import { MultiplierFunction, Spacings } from '../lib/spacing'
import { ICSS, IEffect } from './core'

type AnyMap = {
  [key: string]: any
}

type ColorMap = {
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
  colors: ColorMap
  alternateColors?: {
    [key: string]: ColorMap
  }
  breakpoints?: BreakpointMap
  baseSpacing?: number
  presets?: AnyMap
  borderRadius?: AnyMap
  effects?: EffectsMap
  typography: AnyMap
  icons: AnyMap
  values?: AnyMap
}

export type DefaultColorSchemeName = 'default'

export type ColorScheme<T extends Theme = Theme> = DefaultColorSchemeName | keyof T['alternateColors']

export type AppTheme<T extends Theme> = {
  colors: T['colors']
  breakpoints: T['breakpoints']
  setColorScheme: (colorScheme: ColorScheme<T>) => void
  currentColorScheme: ColorScheme<T>
  spacing: SpacingMap
  presets: DefaultVariants & T['presets']
  borderRadius: T['borderRadius']
  media: MediaQueries
  effects: T['effects']
  border: BorderCreator
  typography: T['typography']
  icons: T['icons']
  values: T['values']
  inset: InsetMap
  baseSpacing: number
  value: (multiplier: number) => number
  sized: (size: number | string) => ICSS
}
