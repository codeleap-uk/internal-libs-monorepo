/* eslint-disable no-restricted-imports */
import {
  VariantProvider,
  DefaultVariantBuilder,
} from './variants'
import { Hooks, MediaQueries } from './MediaQuery'
import { AppSettings } from '../config'
import { Logger } from '../tools/Logger'
import { AnyFunction, FunctionType } from '../types/utility'
import { BorderHelpers } from './helpers'
import { defaultPresets } from './presets'
import { Spacings } from './Spacing'
import { SpacingFunction } from '.'
import { defaultEffects } from './effects'

type AnyProps<T = any> = {
  [x: string]: T
}
export type IconPlaceholder = '__ICON__'
export type BreakpointPlaceholder = '__BREAKPOINT__'

export type DefaultColors =
| 'primary-1'
| 'primary-2'
| 'primary-3'
| 'primary-4'
| 'primary-5'
| 'secondary-1'
| 'secondary-2'
| 'secondary-3'
| 'secondary-4'
| 'secondary-5'
| 'neutral-1'
| 'neutral-2'
| 'neutral-3'
| 'neutral-4'
| 'neutral-5'
| 'neutral-6'
| 'neutral-7'
| 'neutral-8'
| 'neutral-9'
| 'neutral-10'
| 'positive-1'
| 'positive-2'
| 'warning-1'
| 'warning-2'
| 'alert-1'
| 'alert-2'
| 'destructive-1'
| 'destructive-2'
| 'background'
| 'card'
| 'separator'
| 'border'
| 'overlay'
| 'headlines'
| 'body'
| 'caption'

export type Fonts =
  | 'hx'
  | 'h0'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p1'
  | 'p2'
  | 'p3'
  | 'p4'
  | 'p5'

export type ItemHeight =
  | 'default'
  | 'small'
  | 'tiny'

export type IconSizes =
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'

export type BorderWidth =
  | 'small'
  | 'medium'

export type BorderRadius =
  | 'tiny'
  | 'small'
  | 'medium'
  | 'rounded'

export type TransformDirections = 'X' | 'Y'
export type RotateDirections = TransformDirections | 'Z'

type DirectionPrefix = 'top' | 'bottom'
type DirectionSufix = 'right' | 'left'
type DirectionConcat = `${Capitalize<DirectionPrefix>}${Capitalize<DirectionSufix>}`
export type BorderDirections = DirectionPrefix | DirectionSufix | ''
export type BorderColorsDirections = Capitalize<'start' | 'end' | BorderDirections>
export type BorderRadiusDirections = Capitalize<
  | `${DirectionPrefix}End`
  | `${DirectionPrefix}Start`
  | BorderDirections
  | DirectionConcat
>

export type BorderStyle =
  | 'solid'
  | 'dotted'
  | 'dashed'

export type BorderIdentifiers =
  | 'width'
  | 'style'
  | 'radius'
  | 'color'

export type Cursor =
  | 'help'
  | 'wait'
  | 'crosshair'
  | 'not-allowed'
  | 'zoom-in'
  | 'grab'
  | 'pointer'

export type FontTokens =
  | 'base'
  | 'quotes'

export type TypographyStyle = {
  lineHeight?: number
  weight: number
  letterSpacing?: number
  size: number
}

export type Typography = {
  fontFamily: string
  styles: Record<Fonts, TypographyStyle>
  resolveFontFamily?: FunctionType<[
    name: string,
    attrs: FontAttrs
  ], string> | Record<string, string>
}

export type RNShadow = {
  shadowColor: string
  shadowOffset: Record<'width' | 'height', number>
  shadowOpacity: number
  shadowRadius: number
  elevation: number
}

type FreeThemeColors = AnyProps<Record<DefaultColors, string> & AnyProps<string>>

export type FontAttrs = {
  weight: number
  family: string
  size: number
  letterSpacing: number
}

export type AppTheme = {
  readonly breakpoints?: Record<string, number>
  readonly spacing: number
  readonly colors: FreeThemeColors

   values?: {
    width: number
    height: number
    innerSpacing: Record<'X'|'Y', number>
    itemHeight: Record<ItemHeight, number>
    iconSize: Record<IconSizes, number>
    borderWidth: Record<BorderWidth, number>
  } & AnyProps<any>

  readonly borderRadius: Record<BorderRadius, number>

  readonly presets?: Record<string, any>
  readonly effects?: Record<string, RNShadow>

  readonly icons: Record<string, any>
  readonly initialTheme: string
  readonly typography : Record<FontTokens, Typography>
}

export type EnhancedTheme<T extends AppTheme = AppTheme> = Omit<
  T,
  'spacing' | 'effects'
> & {
  spacing: {
    base: number
    gap: SpacingFunction
  } & Spacings<'margin'> &
    Spacings<'padding'>
  hooks: Hooks<keyof T['breakpoints'], boolean>
  media: MediaQueries<keyof T['breakpoints'], string>
  presets: typeof defaultPresets & T['presets']
  border: BorderHelpers<T>
  effects: T['effects'] & typeof defaultEffects
  readonly circle: (size: number) => any

  readonly semiCircle: (side: number) => any
  readonly sized: (multiplier: number) => Record<'height' | 'width', number>
  IsBrowser: boolean
  theme: keyof T['colors']
}
export type ThemeValues = AppTheme

export type StyleContextProps<
  Variants extends Readonly<Record<string, DefaultVariantBuilder>>,
  Provider extends VariantProvider<any, any>
> = {
  variantProvider: Provider
  variants: Variants
  children?: React.ReactNode
  logger?: Logger
  settings: AppSettings

}

export type StyleContextValue<
  C extends Readonly<Record<string, DefaultVariantBuilder>>
> = {
  Theme: EnhancedTheme<any>
  currentTheme: string|number
  provider: VariantProvider<any, any>
  ComponentVariants: C
  logger: Logger
  Settings: AppSettings

}

export type VariantsStylesheet = Record<string, unknown>

export const accessors = ['screenSize'] as const

export type Accessor = typeof accessors[number]

export interface DynamicValueAccessors
  extends Partial<Record<Accessor, AnyFunction>> {
  screenSize?: () => number[]
}

export const spacingVariants = [
  'Vertical',
  'Horizontal',
  'Bottom',
  'Top',
  'Left',
  'Right',
  '',
] as const

export type SpacingVariants = typeof spacingVariants[number]

export type SpacingMultiplier =
  | 'auto'
  | number
  | ''

export type Spacing =
  | `padding${SpacingVariants}:${SpacingMultiplier}`
  | `margin${SpacingVariants}:${SpacingMultiplier}`
  | `gap:${SpacingMultiplier}`
  | `w:${SpacingMultiplier}`
  | `h:${SpacingMultiplier}`

type GetBorder<T> = Extract<BorderIdentifiers, T>

export type Border =
  | `border${Capitalize<BorderDirections>}-${GetBorder<'width'>}:${BorderWidth}`
  | `border-${GetBorder<'style'>}:${BorderStyle}`
  | `border${BorderRadiusDirections}-${GetBorder<'radius'>}:${BorderRadius}`
  | `border${BorderColorsDirections}-${GetBorder<'color'>}:${DefaultColors}`

export type Translate = `translate${TransformDirections | ''}:` & (number | `${number},${number}`)

export type BaseViewProps = {
  css?: any
  is?: string
  not?: string
  up?: string
  down?: string
  onHover?: (isHovering: boolean) => void
}
