/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import { ReactElement } from 'react'
import { QueryKey } from '../MediaQuery'
import {
  BaseViewProps,
  BreakpointPlaceholder,
  EnhancedTheme,
  IconPlaceholder,
  Spacing,
} from '../types'
import { DEFAULT_VARIANTS } from './defaults'
import {
  ComponentVariants,
  FunctionType,
  NestedKeys,
  ReplaceRecursive,
  StylesOf,
} from '../../types'

export type PartialComponentStyle<C extends string, S = any> = Partial<
  Record<C, S>
>;

export type CommonVariantObject<C extends string = string, S = any> = Record<
  string,
  PartialComponentStyle<C, S>
>;

export type DefaultVariantBuilder<CSS = any> = Record<
  string,
  FunctionType<[EnhancedTheme<any>, string], PartialComponentStyle<any, CSS>>
>;
export type FromVariantsBuilder<S, T extends DefaultVariantBuilder<S>> = {
  [Property in keyof T]: ReturnType<T[Property]>;
};

export type VariantProp<T = CommonVariantObject> =
  | string
  | (keyof T | Spacing | `d:${string}`)[];
export type ResponsiveVariantsProp<
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>,
  Styles = CommonVariantObject<any>,
  VP = VariantProp<Styles>
> = Partial<{
  [Property in keyof Theme['breakpoints']]: VP;
}>;

export type GetStylesArgs<
  VariantObject extends CommonVariantObject,
  Theme extends EnhancedTheme<any>,
  Root,
> = [
  styles: VariantObject,
  options: {
    debugName?: string
    variants: VariantProp<VariantObject>;
    rootElement?: Root;
    responsiveVariants?: ResponsiveVariantsProp<Theme, VariantObject>;
    styles?: NestedKeys<VariantObject> extends string
      ? StylesOf<NestedKeys<VariantObject>>
      : any;
  }
];
export type ApplyVariantsArgs = {
  variantName: string;
  styles: any;
  computedStyles: any;
  rootElement: any;
  theme: EnhancedTheme<any>;
};
export type CT<StyleType> = [
  Component: FunctionType<[any], ReactElement | null>,
  style: CommonVariantObject<string, StyleType>
];

export type ComponentStyleMap<CSS = any> = Partial<{
  [x: string]: CT<CSS>;
}>;

// ReplaceRecursive<MergedProps, IconPlaceholder, keyof Theme['icons']>

type ReplaceWithIcons<
  Props,
  Theme extends EnhancedTheme<any>
> = ReplaceRecursive<Props, IconPlaceholder, keyof Theme['icons']>;

type ReplaceWithBreakpoints<
  Props,
  Theme extends EnhancedTheme<any>
> = ReplaceRecursive<Props, BreakpointPlaceholder, keyof Theme['breakpoints']>;

export type ReplaceProps<
  T extends CT<any>,
  Theme extends EnhancedTheme<any>,
  EX = {},
  NewProps = ComponentVariants<T[1], any>,
  Props = Parameters<T[0]>[0],
  MergedProps = Omit<Props, 'responsiveVariants' | 'variants'> & NewProps
> = React.FC<
  ReplaceWithBreakpoints<ReplaceWithIcons<MergedProps & EX, Theme>, Theme>
>;
type ViewPlatformProps = Partial<
  BaseViewProps & Record<QueryKey, BreakpointPlaceholder>
>;

export type TypedComponents<
  T extends ComponentStyleMap = ComponentStyleMap,
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>
> = {
  [Property in keyof T]: Property extends 'View'
    ? ReplaceProps<
        T[Property],
        Theme,
        ViewPlatformProps,
        | ComponentVariants<T[Property][1], Theme>
        | ComponentVariants<T[Property][1]>
      >
    : Property extends keyof DEFAULT_VARIANTS
    ? ReplaceProps<
        T[Property],
        Theme,
        {},
        | ComponentVariants<T[Property][1], Theme>
        | ComponentVariants<T[Property][1]>
      >
    : ReplaceProps<
        T[Property],
        Theme,
        ViewPlatformProps,
        ComponentVariants<T[Property][1], Theme>
      >;
};
