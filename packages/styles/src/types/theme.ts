import { BorderBuilder } from '../lib/borderBuilder'
import { MediaQueries } from '../lib/mediaQuery'
import type { DefaultPresets } from '../lib/presets'
import { SpacingFunction, Spacings } from '../lib/spacing'
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

export type SpacingMap = Spacings<'margin'> & Spacings<'padding'> & {
  base: number
  gap: SpacingFunction
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
}

export type DefaultColorSchemeName = 'default'

export type ColorScheme<T extends Theme = Theme> = DefaultColorSchemeName | keyof T['alternateColors']

export type AppTheme<T extends Theme> = {
  colors: T['colors']
  breakpoints: T['breakpoints']
  setColorScheme: (colorScheme: ColorScheme<T>) => void
  currentColorScheme: ColorScheme<T>
  spacing: SpacingMap
  presets: DefaultPresets & T['presets']
  borderRadius: T['borderRadius']
  media: MediaQueries
  effects: T['effects']
  border: BorderBuilder
}
