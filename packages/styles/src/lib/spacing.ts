import { ICSS } from '../types'
import { spacingVariants, spacingShortVariants, SpacingVariants, SpacingShortVariants } from '../types/spacing'

export type MultiplierFunction = (multiplier: number | string) => ICSS

export type Spacings<T extends string, S = boolean> = {
  [Property in (S extends boolean ? SpacingVariants : SpacingShortVariants) as `${T}${string & Property}`]: MultiplierFunction;
} & {
    [Property in T]: (multiplier: number) => ICSS;
} & {
  value: (multiplier: number) => number
}

const shortMapValues = {
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
  isShort: boolean = false
): any {
  const property = isShort ? shortMapValues[spacingProperty as string] : spacingProperty
  const positions = isShort ? spacingShortVariants : spacingVariants

  const spacings = {
    [`${spacingProperty}`]: (n: number | string) => ({
      [`${property}`]: base * Number(n),
    }),
  }

  for (const _position of positions) {
    const position = isShort ? shortMapValues[_position] : _position
    const key = `${spacingProperty}${_position}`

    let getter = null

    switch (position) {
      case 'Horizontal':
        getter = (value: number) => ({
          [`${property}Left`]: value,
          [`${property}Right`]: value,
        })
      case 'Vertical':
        getter = (value: number) => ({
          [`${property}Top`]: value,
          [`${property}Bottom`]: value,
        })
      case '':
        getter = (value: number) => ({
          [`${property}Top`]: value,
          [`${property}Left`]: value,
          [`${property}Right`]: value,
          [`${property}Bottom`]: value,
        })
      default:
        getter = (value: number) => ({
          [`${property}${position}`]: value,
        })
    }

    spacings[key] = (n: number | string) => {
      if (n == 'auto') return getter('auto')

      const value = base * Number(n)

      return getter(value)
    }
  }

  return spacings
}
