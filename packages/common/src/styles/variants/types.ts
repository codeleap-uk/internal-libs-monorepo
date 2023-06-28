/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import {
  Border,
  BreakpointPlaceholder,
  Cursor,
  DefaultColors,
  EnhancedTheme,
  IconPlaceholder,
  RotateDirections,
  Spacing,
  Translate,
} from '../types'
import {
  FunctionType,
  NestedKeys,
  ReplaceRecursive,
  StylesOf,
} from '../../types'
import { AppTheme } from '..'

export type PartialComponentStyle<C extends string, S = any> = Partial<
  Record<C, S>
>
export type ThemeColorScheme<T extends AppTheme> = Omit<EnhancedTheme<T>, 'colors'> & {colors: T['colors'][keyof T['colors']]}

export type CommonVariantObject<C extends string = string, S = any> = Record<
  string,
  PartialComponentStyle<C, S>
>

export type DefaultVariantBuilder<CSS = any> = Record<
  string,
  FunctionType<[EnhancedTheme<any>, string], PartialComponentStyle<any, CSS>>
>
export type FromVariantsBuilder<S, T extends DefaultVariantBuilder<S>> = {
  [Property in keyof T]: ReturnType<T[Property]>;
}

export type VariantStyleSheet<C extends string, > = Record<C, DefaultVariantBuilder>
export type ComponentVariantsDefinition = Record<string, VariantStyleSheet<string>>

export type AcceptedNullishVariants = boolean | null | undefined | ''

export type DynamicVariants = Spacing | Border | `backgroundColor:${DefaultColors}` | `bg:${DefaultColors}` | `color:${DefaultColors}` | `d:${string}`
| `scale:${number}` | `rotate${RotateDirections}:${number}deg` | Translate
| `cursor:${Cursor}`

export type VariantProp<T = Record<string, any>> =
  string
  | (keyof T | DynamicVariants | AcceptedNullishVariants)[]

export type ResponsiveVariantsProp<
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>,
  Styles = CommonVariantObject<any>,
  VP = VariantProp<Styles>
> = Partial<{
  [Property in keyof Theme['breakpoints']]: VP;
}>

export type GetStylesArgs<
  VariantObject extends CommonVariantObject,
  Theme extends EnhancedTheme<any>,
  Root extends string|number|symbol,
> = [
  styles: VariantObject,
  options: {
    debugName?: string
    variants: VariantProp<VariantObject>
    rootElement?: Root
    responsiveVariants?: ResponsiveVariantsProp<Theme, VariantObject>
    styles?: NestedKeys<VariantObject> extends string
      ? StylesOf<NestedKeys<VariantObject>>
      : any
      size?: {width: number; height: number}
  },
  useTheme?: string
]
export type ApplyVariantsArgs = {
  variantName: string
  styles: any
  computedStyles: any
  rootElement: any
  theme: EnhancedTheme<any>
  wrapStyle?: (style: any) => any
}
export type CT = [
  (props: Record<string, any>) => any,
  Record<string, any>
  // style: FunctionType<[any], CommonVariantObject<string, StyleType>>;
]

export type ComponentStyleMap = Partial<{
  [x: string]: CT
}>

// ReplaceRecursive<MergedProps, IconPlaceholder, keyof Theme['icons']>

export type ReplaceWithIcons<
  Props,
  Theme extends EnhancedTheme<any>
> = ReplaceRecursive<Props, IconPlaceholder, keyof Theme['icons']>

export type ReplaceWithBreakpoints<
  Props,
  Theme extends EnhancedTheme<any>
> = ReplaceRecursive<Props, BreakpointPlaceholder, keyof Theme['breakpoints']>

type WithDynamicVariants<T extends Record<string, any>> = keyof T | DynamicVariants | AcceptedNullishVariants

export type ReplaceWithVariants<T, VariantSheet, Theme extends EnhancedTheme<any>> =
Omit<T, 'variants'|'responsiveVariants'>
& {
  responsiveVariants?: {
    [Breakpoint in keyof Theme['breakpoints']]?: WithDynamicVariants<VariantSheet>[]
  }
  variants?: WithDynamicVariants<VariantSheet>[]
}

export type ReplaceProps<
  T extends CT,
  Theme extends EnhancedTheme<any>
> =
  ReplaceWithBreakpoints<
    ReplaceWithIcons<
      ReplaceWithVariants<
        Parameters<T[0]>[0],
        T[1],
        Theme
      >,
      Theme
    >,
    Theme
  >

export type TypedComponents<
  T extends ComponentStyleMap,
  Theme extends EnhancedTheme<any>
> = {
  [Property in keyof T]: (props: ReplaceProps<
    T[Property],
    Theme
  >) => JSX.Element

}
