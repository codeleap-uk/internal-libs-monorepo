import { ICSS } from '../types'
import { spacingVariants, spacingShortVariants, SpacingVariants, SpacingShortVariants } from '../types/spacing'

export type MultiplierFunction = (multiplier: number | string) => ICSS

export type Spacings<T extends string, S = boolean> = {
  [Property in (S extends boolean ? SpacingVariants : SpacingShortVariants) as `${T}${string & Property}`]: MultiplierFunction;
} & {
  [Property in T]: (multiplier: number) => ICSS;
} & {
  value: (multiplier?: number) => number
}

const mapValues = {
  'x': 'Horizontal',
  'y': 'Vertical',
  'l': 'Left',
  'r': 'Right',
  't': 'Top',
  'b': 'Bottom',
  'm': 'margin',
  'p': 'padding'
}

export function spacingFactory<T extends string>(
  base: number,
  spacingProperty: T,
  hasMapValue: boolean = false
) {
  // @ts-ignore
  const property =  hasMapValue ? mapValues[spacingProperty] : spacingProperty
  const positions = hasMapValue ? spacingShortVariants : spacingVariants

  const functions = positions.map((position: string) => {
    const v: string = hasMapValue ? mapValues[position] : position

    return [
      `${spacingProperty}${position}`,
      (n: number | string) => {
        const value = base * Number(n)
  
        switch (v) {
          case 'Horizontal':
            return {
              [`${property}Left`]: value,
              [`${property}Right`]: value,
            }
          case 'Vertical':
            return {
              [`${property}Top`]: value,
              [`${property}Bottom`]: value,
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
    ]
  })

  return {
    value: (n = 1) => base * n,
    ...Object.fromEntries(functions),
    [`${spacingProperty}`]: (n: number | string) => ({
      [`${property}`]: base * Number(n),
    }),
  }
}
