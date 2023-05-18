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
| 'primary1'
| 'primary2'
| 'primary3'
| 'primary4'
| 'primary5'
| 'secondary1'
| 'secondary2'
| 'secondary3'
| 'secondary4'
| 'secondary5'
| 'neutral1'
| 'neutral2'
| 'neutral3'
| 'neutral4'
| 'neutral5'
| 'neutral6'
| 'neutral7'
| 'neutral8'
| 'neutral9'
| 'neutral10'
| 'positive1'
| 'positive2'
| 'warning1'
| 'warning2'
| 'alert1'
| 'alert2'
| 'destructive1'
| 'destructive2'
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
  } & AnyProps<any>

  readonly borderRadius: {
    tiny: number
    small: number
    medium: number
    rounded: number
  }

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

export type BaseViewProps = {
  css?: any
  is?: string
  not?: string
  up?: string
  down?: string
  onHover?: (isHovering: boolean) => void
}
