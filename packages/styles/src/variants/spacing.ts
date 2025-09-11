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

const shortPositionMap = {
  'x': 'Horizontal',
  'y': 'Vertical',
  'l': 'Left',
  'r': 'Right',
  't': 'Top',
  'b': 'Bottom'
}

export function spacingFactory<T extends string>(
  base: number,
  spacingProperty: T,
  isShort: boolean = false
): any {
  const baseProperty = isShort ? shortMapValues[spacingProperty as keyof typeof shortMapValues] : spacingProperty
  const positions = isShort ? spacingShortVariants : spacingVariants

  const spacings = {
    [`${spacingProperty}`]: (n: number | string) => {
      if (n === 'auto') {
        return { [baseProperty]: 'auto' }
      }
      return { [baseProperty]: base * Number(n) }
    },
  }

  for (const _position of positions) {
    const position = isShort
      ? shortPositionMap[_position as keyof typeof shortPositionMap] || _position
      : _position

    const key = `${spacingProperty}${_position}`

    let getter = null

    switch (position) {
      case 'Horizontal':
        getter = (value: number | string) => ({
          [`${baseProperty}Left`]: value,
          [`${baseProperty}Right`]: value,
        })
        break
      case 'Vertical':
        getter = (value: number | string) => ({
          [`${baseProperty}Top`]: value,
          [`${baseProperty}Bottom`]: value,
        })
        break
      case '':
        getter = (value: number | string) => ({
          [`${baseProperty}Top`]: value,
          [`${baseProperty}Right`]: value,
          [`${baseProperty}Bottom`]: value,
          [`${baseProperty}Left`]: value,
        })
        break
      default:
        getter = (value: number | string) => ({
          [`${baseProperty}${position}`]: value,
        })
        break
    }

    spacings[key] = (n: number | string) => {
      if (n === 'auto') return getter('auto')
      const value = base * Number(n)
      return getter(value)
    }
  }

  return spacings
}
