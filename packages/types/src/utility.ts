import { ReactNode } from 'react'
import { Prev } from './pathMapping'
/* eslint-disable no-unused-vars */
export type AnyFunction = (...args: any[]) => any

export type AnyRecord = Record<string, any>

export type ReadOnly<T> = {
  readonly [Property in keyof T]: T[Property];
}

export type NestedKeys<T> = {
  [K in keyof T]: T[K] extends Record<any, any> ? keyof T[K] : never;
}[keyof T]

export type FunctionType<Args extends any[], Return> = (
  ...args: Args
) => Return

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

export type ReplaceRecursive<T, Replace, With, D extends number = 10> = [D] extends [never] ? never : {
  [Property in keyof T]: T[Property] extends Replace
    ? With
    : IsDict<T[Property]> extends true
    ? ReplaceRecursive<T[Property], Replace, With, Prev[D]>
    : T[Property];
}
export type SmartOmit<T, K extends keyof T> = {
  [Property in Exclude<keyof T, K>]: T[Property];
}

export type PropsOf<T, Exclude extends string = ''> = T extends React.ComponentType<infer P> ? Omit<P, Exclude> : any

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

export type FilterKeys<T, Filter = any> = Exclude<{
  [P in keyof T]: T[P] extends Filter ? P : '__never__'
}[keyof T], '__never__'>

export type ReactState<T = any> = [
  T,
  React.Dispatch<React.SetStateAction<T>>
]

export type ReactStateProps<Name extends string, T = any, State extends ReactState<T> = ReactState<T>> = {
  [P in Name as `set${Capitalize<Name>}`]: State[1]
} & {
  [P in Name ]: State[0]
}

export type AnyRef<T> = React.Ref<T> | React.MutableRefObject<T> | ((instance: T | null) => void) | null | React.ForwardedRef<T> | React.LegacyRef<T>

export type Indices<T extends readonly any[]> = Exclude<Partial<T>['length'], T['length']>

export type Replace<Object, Keys extends keyof Object, With = any> = Omit<Object, Keys> & {
  [P in Keys]: With
}

export type Matcher<T> = string | Partial<RegExp> | FunctionType<[valueOrKey: any, type: T], boolean>

export type LogType = 'info' | 'debug' | 'warn' | 'error' | 'log' | 'silent'

export type SecondToLastArguments<T extends AnyFunction> = T extends ((...args: [infer _, ...infer Rest]) => any) ? Rest : never

export type Options<T> = { label: string; value: T }[]

export type Option<T> = Options<T>[number]

export type Label = string | ReactNode