import { IColors, ICSS } from '../types'
import { StyleConstants } from './constants'
import { borderDirection } from './dynamicVariants'
import { themeStore } from './themeStore'
import { capitalize } from './utils'

type BorderCreatorArgs = {
  color: keyof IColors | (string & {})
  width?: number | string
  directions?: typeof borderDirection[number][]
  // @ts-expect-error borderStyle not exists
  style?: ICSS['borderStyle']
}

export type BorderCreator = (args: BorderCreatorArgs) => ICSS

export const borderCreator: BorderCreator = (args) => {
  const {
    color: colorKey,
    width = 1,
    style = 'solid',
    directions = ['left', 'top', 'bottom', 'right'],
  } = args

  const theme = themeStore.getState().current

  // @ts-expect-error
  const color = theme?.colors?.[colorKey] ?? colorKey

  const borderStyles: ICSS = {}

  for (const direction of directions) {
    const property = `border${capitalize(direction)}`

    borderStyles[`${property}Color`] = color
    borderStyles[`${property}Width`] = width

    if (StyleConstants.IS_BROWSER) {
      borderStyles[`${property}Style`] = style
    }
  }

  return borderStyles
}
