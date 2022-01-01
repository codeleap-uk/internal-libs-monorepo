import {  CommonVariantObject, EnhancedTheme, ResponsiveVariantsProp, VariantProp } from '..'

/* eslint-disable no-unused-vars */
export type AnyFunction = (...args: any[]) => any;

export type ReadOnly<T> = {
  readonly [Property in keyof T]: T[Property];
};

export type NestedKeys<T> = {
  [K in keyof T]: T[K] extends Record<any, any> ? keyof T[K] : never;
}[keyof T];

export type FunctionType<Args extends any[], Return> = (...args: Args) => Return;


export type ComponentVariants<
  Styles extends CommonVariantObject<any, any> = CommonVariantObject<any, any>,
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>,
  VP = VariantProp<Styles>
> = {
  variants?: VP
  responsiveVariants?: ResponsiveVariantsProp<Theme, Styles, VP>
}


export type ComponentWithVariants<
  Styles extends CommonVariantObject<any, any> = CommonVariantObject<any, any>,
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>,
  P = Record<string, unknown>
> = React.FC<ComponentVariants<Styles, Theme> & P>


export type DeepPartial<T> = Partial<{
  [Property in keyof T] : T[Property] extends Record<string, any> ? DeepPartial<T[Property]> : Partial<T[Property]>
}>


type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;

type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];

export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;

export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

export type StylesOf<C extends string = any, CSS = any> = Record<C, CSS>;

export type ReplaceRecursive<T, Replace, With> = {
  [Property in keyof T] : 
    T[Property] extends Replace ?  
      With : 
      T[Property] extends Record<any, any> ? 
        ReplaceRecursive<T[Property], Replace, With> : 
        T[Property]
}
