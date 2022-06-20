import {
  BreakpointPlaceholder,
  CommonVariantObject,
  EnhancedTheme,
  ResponsiveVariantsProp,
  VariantProp,
} from '..'

/* eslint-disable no-unused-vars */
export type AnyFunction = (...args: any[]) => any

export type ReadOnly<T> = {
  readonly [Property in keyof T]: T[Property];
}

export type NestedKeys<T> = {
  [K in keyof T]: T[K] extends Record<any, any> ? keyof T[K] : never;
}[keyof T]

export type FunctionType<Args extends any[], Return> = (
  ...args: Args
) => Return

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
  [Property in keyof T]: T[Property] extends Record<string, any>
    ? T[Property] extends null|RegExp
      ? any
      : DeepPartial<T[Property]>
    : T[Property] extends null|RegExp
      ? any
      : Partial<T[Property]>;
}>

type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T
  ? ((t: T, ...a: A) => void) extends (...x: infer X) => void
    ? X
    : never
  : never

type EnumerateInternal<A extends Array<unknown>, N extends number> = {
  0: A
  1: EnumerateInternal<PrependNextNum<A>, N>
}[N extends A['length'] ? 0 : 1]

export type Enumerate<N extends number> = EnumerateInternal<
  [],
  N
> extends (infer E)[]
  ? E
  : never

export type Range<FROM extends number, TO extends number> = Exclude<
  Enumerate<TO>,
  Enumerate<FROM>
>

export type StylesOf<
  C extends string | number | symbol = any,
  CSS = any
> = Partial<Record<C, CSS>>

type IsDict<T> = T extends AnyFunction
  ? false
  : T extends Record<string, any>
  ? true
  : false

export type ReplaceRecursive<T, Replace, With> = {
  [Property in keyof T]: T[Property] extends Replace
    ? With
    : IsDict<T[Property]> extends true
    ? ReplaceRecursive<T[Property], Replace, With>
    : T[Property];
}
export type SmartOmit<T, K extends keyof T> = {
  [Property in Exclude<keyof T, K>]: T[Property];
}

export type PropsOf<T> = T extends React.ComponentType<infer P> ? P : never

export type Hashmap<T> = {
  [key: string]: T
}

export type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

export type AsyncReturnType<T> = T extends (...args: any[]) => Promise<infer U> ? U : never

export type VariantsOf<T> =T extends ((props: {variants: infer V}) => any) ?
  (V extends (string | string[]) ? V : (string[]))

  : (string[])

export type VariantList<T> = Exclude<T, string>

export type GetRefType<T> = T extends React.Ref<infer U> ? U : never
