/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-imports */
import { CSSProperties } from 'react'
import { SpacingVariants,  spacingVariantsShort } from '.';
import { spacingVariants } from './types'

export type SpacingFunction = (multiplier: number|string) => CSSProperties;

export type Spacings<T extends string> = {
  [Property in SpacingVariants as `${T}${string & Property}`]: SpacingFunction;
} & {
  [Property in T]: (multiplier: number) => CSSProperties;
} & {

  value:  (multiplier?: number) => number
};

export function spacingFactory<T extends string>(base: number, p: T): Spacings<T> {
  let property = p
  if (p.length === 1){
    property = (p === 'p' ? 'padding' : 'margin') as T
  }

  const functions = [...spacingVariants, ...spacingVariantsShort].map((v) => [
    `${p}${v}`,
    (n: number|string) => {
      const value = typeof n === 'string' ? n :base * n
      switch (v) {
        case 'Horizontal':
        case 'h':
          return {
            [`${property}Left`]: value,
            [`${property}Right`]: value,
          }
        case 'Vertical':
        case 'v':
          return {
            [`${property}Top`]: value,
            [`${property}Bottom`]: value,
          }
        
        case 'l':
          return {
            [`${property}Left`]: value,
          }
        case 'r':
          return {
            [`${property}Right`]: value,
          }
        case 'b':
          return {
            [`${property}Bottom`]: value,
          }
        case 't':
          return {
            [`${property}Top`]: value,
          }
        case '':
          return {
            [`${property}Top`]: value,
            [`${property}Left`]: value,
            [`${property}Right`]: value,
            [`${property}Bottom`]: value,
          }
        default:
          return {
            [`${property}${v}`]: value,
          }
      }
    },
  ])

  return {
    [`${p}`]: (n: number|string) => ({
      [`${property}`]: typeof n === 'string' ? n : base * n,
    }),
    value: (n = 1) => base * n,
    ...Object.fromEntries(functions),
  }
}
