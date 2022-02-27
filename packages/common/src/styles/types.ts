/* eslint-disable no-restricted-imports */
import {
  DefaultVariants,
  VariantProvider,
  CommonVariantObject,
} from './variants'
import { Hooks, MediaQueries } from './MediaQuery'
import { AppSettings } from '../config'
import { Logger } from '../tools/Logger'
import { AnyFunction } from '../types/utility'
import { BorderHelpers } from './helpers'
import { defaultPresets } from './presets'
import { Spacings } from './Spacing'

type AnyProps<T = any> = {
  [x: string]: T
}
export type IconPlaceholder = '__ICON__'
export type BreakpointPlaceholder = '__BREAKPOINT__'

export type DefaultColors =
  | 'primary'
  | 'secondary'
  | 'background'
  | 'backgroundSecondary'
  | 'text'
  | 'icon'
  | 'border'
  | 'positive'
  | 'negative'
  | 'placeholder'
  | 'disabled'
  | 'neutral'
  | 'textH'
  | 'textP'
  | 'black'
  | 'white'

export type Fonts =
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

export type TypographyStyle = {
  lineHeight?: number
  weigth: number
  color?: string
  fontFamily?: string
  sizeMultiplier?: number
  lineHeightMultiplier?: number
  size?: {
    multiplier: number
    viewport: number
    max: number
    min: number
  }
}

type FreeThemeColors = AnyProps<Record<DefaultColors, string> & AnyProps<string>>

export type AppTheme = {
  readonly breakpoints?: Record<string, number>
  readonly spacing: number
  readonly colors: FreeThemeColors

  readonly values?: {
    width?: number
    height?: number
  } & AnyProps<any>

  readonly borderRadius: {
    large: number
    medium: number
    small: number
  }

  readonly presets ?: Record<string, any>

  readonly icons: Record<string, any>
  readonly initialTheme: string
  readonly typography : {
    fontFamily: string
    styles: Record<Fonts, TypographyStyle>
    baseFontSize: number
    pColor: string
    hColor: string
  }
}

export type EnhancedTheme<T extends AppTheme = AppTheme> = Omit<
  T,
  'spacing'
> & {
  spacing: {
    base: number
  } & Spacings<'margin'> &
    Spacings<'padding'>
  hooks: Hooks<keyof T['breakpoints'], boolean>
  media: MediaQueries<keyof T['breakpoints'], string>
  presets: typeof defaultPresets & T['presets']
  border: BorderHelpers<T>
  readonly circle: (size: number) => any

  readonly semiCircle: (side: number) => any
  readonly sized: (multiplier: number) => Record<'height' | 'width', number>
  IsBrowser: boolean
  theme: keyof T['colors']
}
export type ThemeValues = AppTheme

export type StyleContextProps<
  Variants extends DefaultVariants,
  Provider extends VariantProvider<any, any>
> = {
  variantProvider: Provider
  variants: Variants
  children?: React.ReactNode
  logger?: Logger
  settings: AppSettings

}

export type StyleContextValue<
  C extends Readonly<Record<string, CommonVariantObject<any>>>
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
  | '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | '11'
  | '12'
  | 'auto'

export type Spacing =
  | `padding${SpacingVariants}:${SpacingMultiplier}`
  | `margin${SpacingVariants}:${SpacingMultiplier}`

export type BaseViewProps = {
  css?: any
  is?: string
  not?: string
  up?: string
  down?: string
  onHover?: (isHovering: boolean) => void
}
