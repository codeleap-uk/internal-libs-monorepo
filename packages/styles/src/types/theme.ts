import { BorderBuilder } from '../lib/borderBuilder'
import { MediaQueries } from '../lib/mediaQuery'
import type { DefaultVariants } from '../lib/defaultVariants'
import { MultiplierFunction, Spacings } from '../lib/spacing'
import { IEffect } from './core'

type ColorMap = {
  [key: string]: string
}

type BreakpointMap = {
  [key: string]: number
}

type PresetsMap = {
  [key: string]: any
}

type BorderRadiusMap = {
  [key: string]: any
}

type EffectsMap = {
  [key: string]: IEffect
}

type Typography = {
  [key: string]: any
}

type IconsMap = {
  [key: string]: any
}

type ValuesMap = {
  [key: string]: any
}

export type SpacingMap = 
  Spacings<'margin'> & 
  Spacings<'padding'> &
  Spacings<'m', string> &
  Spacings<'p', string> &
  {
    base: number
    gap: MultiplierFunction
  }

export type InsetMap = 
  {
    base: number
    value: (multiplier: number) => number
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
  presets?: PresetsMap
  borderRadius?: BorderRadiusMap
  effects?: EffectsMap
  typography: Typography
  icons: IconsMap
  values?: ValuesMap
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
  border: BorderBuilder
  typography: T['typography']
  icons: T['icons']
  values: T['values']
  inset: InsetMap
  sized: (size: number | string) => ({
    width: number | string,
    height: number | string
  })
}
