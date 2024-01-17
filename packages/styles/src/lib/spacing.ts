import { ICSS } from '../types'
import { spacingVariants, SpacingVariants } from '../types/spacing'

export type SpacingFunction = (multiplier: number | string) => any

export type Spacings<T extends string> = {
  [Property in SpacingVariants as `${T}${string & Property}`]: SpacingFunction;
} & {
  [Property in T]: (multiplier: number) => ICSS;
} & {
  value: (multiplier?: number) => number
}

export function spacingFactory<T extends string>(
  base: number,
  property: T,
): Spacings<T> {
  const positions = property == 'gap' ? [''] : spacingVariants

  const functions = positions.map((v) => [
    `${property}${v}`,
    (n: number | string) => {
      const value = base * Number(n)

      if (property === 'gap') {
        return {
          gap: value,
        }
      }

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
  ])

  return {
    value: (n = 1) => base * n,
    ...Object.fromEntries(functions),
    [`${property}`]: (n: number | string) => ({
      [`${property}`]: base * Number(n),
    }),
  }
}
