import { CSSProperties } from 'react'
import { BorderDirections, ThemeValues } from './types'
import { capitalize } from '../utils'

type BorderArgs = {
  width: number | string
  style?: CSSProperties['borderStyle']
  color?: string
  directions?: BorderDirections[]
}

export type BorderHelpers<T extends ThemeValues> = {
  [Property in keyof T['colors'][keyof T['colors']]]: (
    args: Omit<BorderArgs, 'color'> | number
  ) => any;
} & {
  create: (args: BorderArgs) => any
}

export function createBorderHelpers<T extends ThemeValues>(
  values: T,
  browser: boolean,
  theme: string,
): BorderHelpers<T> {
  const helpers = {
    create: ({
      width,
      color,
      style = 'solid',
      directions = ['left', 'top', 'bottom', 'right'],
    }) => {
      const borderStyles = {}

      for (const direction of directions) {
        const property = `border${capitalize(direction)}`
        borderStyles[`${property}Color`] = color
        borderStyles[`${property}Width`] = width
        if (browser) {
          borderStyles[`${property}Style`] = style
        }
      }

      return borderStyles
    },
  }
  const allColors = Object.entries(values.colors[theme])

  for (const [name, color] of allColors) {
    helpers[name] = (args) => {
      if (typeof args === 'number') {
        return helpers.create({
          width: args,
          color,
        })
      } else {
        const {
          width,
          style = 'solid',
          directions = ['left', 'top', 'bottom', 'right'],
        } = args
        return helpers.create({
          width,
          style,
          directions,
          color,
        })
      }
    }
  }

  return helpers as BorderHelpers<T>
}
