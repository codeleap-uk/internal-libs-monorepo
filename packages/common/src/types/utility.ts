import { CommonVariantObject, EnhancedTheme, ResponsiveVariantsProp, VariantProp } from '..'

/* eslint-disable no-unused-vars */
export type AnyFunction = (...args: any[]) => any;

export type ReadOnly<T> = {
  readonly [Property in keyof T]: T[Property];
};

export type NestedKeys<T> = {
  [K in keyof T]-?: T[K] extends object ? keyof T[K] : K;
}[keyof T];

export type FunctionType<Args extends any[], Return> = (...args: Args) => Return;


export type ComponentVariants<
  Styles extends CommonVariantObject<any, any> = CommonVariantObject<any, any>,
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>
> = {
  variants?: VariantProp<Styles>
  responsiveVariants?: ResponsiveVariantsProp<Theme, Styles>
}


export type ComponentWithVariants<
  Styles extends CommonVariantObject<any, any> = CommonVariantObject<any, any>,
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>,
  P = Record<string, unknown>
> = React.FC<ComponentVariants<Styles, Theme> & P>


export type DeepPartial<T> = Partial<{
  [Property in keyof T] : T[Property] extends object ? DeepPartial<T[Property]> : Partial<T[Property]>
}>
