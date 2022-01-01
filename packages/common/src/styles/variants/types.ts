/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import { CSSProperties } from 'react'

import { EnhancedTheme, Spacing } from '..'
import { FunctionType } from '../..'

type DynamicComponentStyle<C extends string, S = CSSProperties> = FunctionType<any[], Partial<Record<C, S>>>
export type PartialComponentStyle<C extends string, S = CSSProperties> = Partial<Record<C, S>>  ;

export type CommonVariantObject<C extends string = string, S = CSSProperties> = Record<string, PartialComponentStyle<C, S> >;


export type DefaultVariantBuilder<CSS = React.CSSProperties> = Record<string, FunctionType<[EnhancedTheme<any>, string], PartialComponentStyle<any, CSS >>>;
export type FromVariantsBuilder<S, T extends DefaultVariantBuilder<S>> = {
  [Property in keyof T]: ReturnType<T[Property]>;
};

export type VariantProp<T = CommonVariantObject> = string | (keyof T | Spacing | `d:${string}`)[]
export type ResponsiveVariantsProp<
  Theme extends EnhancedTheme<any> = EnhancedTheme<any>, 
  Styles = CommonVariantObject<any>,
  VP =  VariantProp<Styles>
> = Partial<{
  [Property in keyof Theme['breakpoints']] : VP
}>
